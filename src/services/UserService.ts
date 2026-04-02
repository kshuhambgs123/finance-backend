import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole, UserStatus } from '../entities/User';
import { AppError } from '../utils/AppError';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../dto/user.dto';
import { PaginationResult, getPaginationParams, createPaginationResult } from '../utils/pagination';
import { Like, FindManyOptions } from 'typeorm';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(createUserDto: CreateUserDto, createdBy: User): Promise<Partial<User>> {
    // Only admins can create users
    if (createdBy.role !== UserRole.ADMIN) {
      throw new AppError('Only administrators can create users', 403);
    }

    const { firstName, lastName, email, role, status = UserStatus.ACTIVE } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Generate temporary password
    const tempPassword = this.generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      status,
    });

    await this.userRepository.save(user);

    // Return user without password but include temp password for admin
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      tempPassword, // Only returned during creation
    };
  }

  async getUsers(queryDto: UserQueryDto, requestingUser: User): Promise<PaginationResult<Partial<User>>> {
    // Only admins and analysts can view all users
    if (requestingUser.role === UserRole.VIEWER) {
      throw new AppError('Insufficient permissions to view users', 403);
    }

    const { page, limit, skip } = getPaginationParams(queryDto);
    const { role, status, search } = queryDto;

    const whereConditions: any = {};

    if (role) {
      whereConditions.role = role;
    }

    if (status) {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions = [
        { ...whereConditions, firstName: Like(`%${search}%`) },
        { ...whereConditions, lastName: Like(`%${search}%`) },
        { ...whereConditions, email: Like(`%${search}%`) },
      ];
    }

    const findOptions: FindManyOptions<User> = {
      where: whereConditions,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'status', 'lastLoginAt', 'createdAt', 'updatedAt'],
    };

    const [users, totalItems] = await this.userRepository.findAndCount(findOptions);

    return createPaginationResult(users, totalItems, page, limit);
  }

  async getUserById(id: string, requestingUser: User): Promise<Partial<User>> {
    // Users can view their own profile, admins and analysts can view any profile
    if (requestingUser.role === UserRole.VIEWER && requestingUser.id !== id) {
      throw new AppError('Insufficient permissions to view this user', 403);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'status', 'lastLoginAt', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, requestingUser: User): Promise<Partial<User>> {
    // Users can update their own profile (limited fields), admins can update any user
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check permissions
    if (requestingUser.role !== UserRole.ADMIN && requestingUser.id !== id) {
      throw new AppError('Insufficient permissions to update this user', 403);
    }

    // Non-admins can only update their own basic info
    if (requestingUser.role !== UserRole.ADMIN && requestingUser.id === id) {
      const allowedFields = ['firstName', 'lastName'];
      const updateFields = Object.keys(updateUserDto);
      const hasRestrictedFields = updateFields.some(field => !allowedFields.includes(field));
      
      if (hasRestrictedFields) {
        throw new AppError('You can only update your first name and last name', 403);
      }
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }
    }

    // Update user
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string, requestingUser: User): Promise<void> {
    // Only admins can delete users
    if (requestingUser.role !== UserRole.ADMIN) {
      throw new AppError('Only administrators can delete users', 403);
    }

    // Prevent self-deletion
    if (requestingUser.id === id) {
      throw new AppError('You cannot delete your own account', 400);
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Soft delete by setting status to inactive
    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { status: UserStatus.ACTIVE } });
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
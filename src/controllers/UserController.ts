import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../dto/user.dto';

export class UserController {
  private userService = new UserService();

  createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const createUserDto: CreateUserDto = req.body;
      const createdBy = req.user!;
      
      const user = await this.userService.createUser(createUserDto, createdBy);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const queryDto: UserQueryDto = req.query as any;
      const requestingUser = req.user!;
      
      const result = await this.userService.getUsers(queryDto, requestingUser);

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const requestingUser = req.user!;
      
      const user = await this.userService.getUserById(id, requestingUser);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = req.body;
      const requestingUser = req.user!;
      
      const user = await this.userService.updateUser(id, updateUserDto, requestingUser);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const requestingUser = req.user!;
      
      await this.userService.deleteUser(id, requestingUser);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getUserStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.userService.getUserStats();

      res.status(200).json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
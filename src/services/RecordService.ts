import { AppDataSource } from '../config/database';
import { FinancialRecord, RecordType } from '../entities/FinancialRecord';
import { User, UserRole } from '../entities/User';
import { AppError } from '../utils/AppError';
import { CreateRecordDto, UpdateRecordDto, RecordQueryDto } from '../dto/record.dto';
import { PaginationResult, getPaginationParams, createPaginationResult } from '../utils/pagination';
import { Between, Like, FindManyOptions, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class RecordService {
  private recordRepository = AppDataSource.getRepository(FinancialRecord);

  async createRecord(createRecordDto: CreateRecordDto, user: User): Promise<FinancialRecord> {
    // Check if user can create records
    if (!user.canCreateRecords) {
      throw new AppError('Insufficient permissions to create records', 403);
    }

    const record = this.recordRepository.create({
      ...createRecordDto,
      date: new Date(createRecordDto.date),
      createdBy: user,
    });

    return await this.recordRepository.save(record);
  }

  async getRecords(queryDto: RecordQueryDto, user: User): Promise<PaginationResult<FinancialRecord>> {
    const { page, limit, skip } = getPaginationParams(queryDto);
    const { 
      type, 
      category, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount, 
      search, 
      sortBy = 'date', 
      sortOrder = 'desc' 
    } = queryDto;

    const whereConditions: any = {
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    if (type) {
      whereConditions.type = type;
    }

    if (category) {
      whereConditions.category = category;
    }

    if (startDate && endDate) {
      whereConditions.date = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      whereConditions.date = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      whereConditions.date = LessThanOrEqual(new Date(endDate));
    }

    if (minAmount !== undefined && maxAmount !== undefined) {
      whereConditions.amount = Between(minAmount, maxAmount);
    } else if (minAmount !== undefined) {
      whereConditions.amount = MoreThanOrEqual(minAmount);
    } else if (maxAmount !== undefined) {
      whereConditions.amount = LessThanOrEqual(maxAmount);
    }

    if (search) {
      whereConditions.description = Like(`%${search}%`);
    }

    const findOptions: FindManyOptions<FinancialRecord> = {
      where: whereConditions,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder.toUpperCase() as 'ASC' | 'DESC' },
      relations: ['createdBy'],
    };

    const [records, totalItems] = await this.recordRepository.findAndCount(findOptions);

    return createPaginationResult(records, totalItems, page, limit);
  }

  async getRecordById(id: string, user: User): Promise<FinancialRecord> {
    const record = await this.recordRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy'],
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    // Check access permissions
    if (!user.canViewAllRecords && record.createdBy.id !== user.id) {
      throw new AppError('Insufficient permissions to view this record', 403);
    }

    return record;
  }

  async updateRecord(id: string, updateRecordDto: UpdateRecordDto, user: User): Promise<FinancialRecord> {
    const record = await this.recordRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy'],
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    // Check permissions - only admins or record creators can update
    if (user.role !== UserRole.ADMIN && record.createdBy.id !== user.id) {
      throw new AppError('Insufficient permissions to update this record', 403);
    }

    // Update record
    Object.assign(record, {
      ...updateRecordDto,
      ...(updateRecordDto.date && { date: new Date(updateRecordDto.date) }),
    });

    return await this.recordRepository.save(record);
  }

  async deleteRecord(id: string, user: User): Promise<void> {
    const record = await this.recordRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy'],
    });

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    // Check permissions - only admins or record creators can delete
    if (user.role !== UserRole.ADMIN && record.createdBy.id !== user.id) {
      throw new AppError('Insufficient permissions to delete this record', 403);
    }

    // Soft delete
    record.isDeleted = true;
    await this.recordRepository.save(record);
  }

  async getRecordsByDateRange(startDate: Date, endDate: Date, user: User): Promise<FinancialRecord[]> {
    const whereConditions: any = {
      date: Between(startDate, endDate),
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    return await this.recordRepository.find({
      where: whereConditions,
      order: { date: 'DESC' },
      relations: ['createdBy'],
    });
  }

  async getRecordsByCategory(category: string, user: User): Promise<FinancialRecord[]> {
    const whereConditions: any = {
      category,
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    return await this.recordRepository.find({
      where: whereConditions,
      order: { date: 'DESC' },
      relations: ['createdBy'],
    });
  }

  async bulkDeleteRecords(ids: string[], user: User): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new AppError('Only administrators can perform bulk operations', 403);
    }

    await this.recordRepository.update(
      ids,
      { isDeleted: true }
    );
  }
}
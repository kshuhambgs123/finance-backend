import { Request, Response, NextFunction } from 'express';
import { RecordService } from '../services/RecordService';
import { AuthRequest } from '../middleware/auth';
import { CreateRecordDto, UpdateRecordDto, RecordQueryDto } from '../dto/record.dto';

export class RecordController {
  private recordService = new RecordService();

  createRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const createRecordDto: CreateRecordDto = req.body;
      const user = req.user!;
      
      const record = await this.recordService.createRecord(createRecordDto, user);

      res.status(201).json({
        success: true,
        message: 'Financial record created successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecords = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const queryDto: RecordQueryDto = req.query as any;
      const user = req.user!;
      
      const result = await this.recordService.getRecords(queryDto, user);

      res.status(200).json({
        success: true,
        message: 'Financial records retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecordById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      
      const record = await this.recordService.getRecordById(id, user);

      res.status(200).json({
        success: true,
        message: 'Financial record retrieved successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateRecordDto: UpdateRecordDto = req.body;
      const user = req.user!;
      
      const record = await this.recordService.updateRecord(id, updateRecordDto, user);

      res.status(200).json({
        success: true,
        message: 'Financial record updated successfully',
        data: record,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRecord = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user!;
      
      await this.recordService.deleteRecord(id, user);

      res.status(200).json({
        success: true,
        message: 'Financial record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getRecordsByCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { category } = req.params;
      const user = req.user!;
      
      const records = await this.recordService.getRecordsByCategory(category, user);

      res.status(200).json({
        success: true,
        message: `Records for category '${category}' retrieved successfully`,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  bulkDeleteRecords = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const user = req.user!;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of record IDs',
        });
      }

      await this.recordService.bulkDeleteRecords(ids, user);

      res.status(200).json({
        success: true,
        message: `${ids.length} records deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
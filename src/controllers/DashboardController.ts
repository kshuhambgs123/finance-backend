import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/DashboardService';
import { AuthRequest } from '../middleware/auth';
import { RecordType } from '../entities/FinancialRecord';

export class DashboardController {
  private dashboardService = new DashboardService();

  getDashboardSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const summary = await this.dashboardService.getDashboardSummary(user, start, end);

      res.status(200).json({
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };

  getIncomeVsExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { period = 'month' } = req.query;
      
      if (!['week', 'month', 'year'].includes(period as string)) {
        return res.status(400).json({
          success: false,
          message: 'Period must be one of: week, month, year',
        });
      }

      const comparison = await this.dashboardService.getIncomeVsExpenses(
        user, 
        period as 'week' | 'month' | 'year'
      );

      res.status(200).json({
        success: true,
        message: 'Income vs expenses comparison retrieved successfully',
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryAnalysis = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { type } = req.query;
      
      let recordType: RecordType | undefined;
      if (type) {
        if (!Object.values(RecordType).includes(type as RecordType)) {
          return res.status(400).json({
            success: false,
            message: 'Type must be either income or expense',
          });
        }
        recordType = type as RecordType;
      }

      const analysis = await this.dashboardService.getCategoryAnalysis(user, recordType);

      res.status(200).json({
        success: true,
        message: 'Category analysis retrieved successfully',
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyComparison = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { months = '6' } = req.query;
      
      const monthsNumber = parseInt(months as string);
      if (isNaN(monthsNumber) || monthsNumber < 1 || monthsNumber > 24) {
        return res.status(400).json({
          success: false,
          message: 'Months must be a number between 1 and 24',
        });
      }

      const trends = await this.dashboardService.getMonthlyComparison(user, monthsNumber);

      res.status(200).json({
        success: true,
        message: 'Monthly trends retrieved successfully',
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  };

  getTopCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { type } = req.params;
      const { limit = '5' } = req.query;
      
      if (!Object.values(RecordType).includes(type as RecordType)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be either income or expense',
        });
      }

      const limitNumber = parseInt(limit as string);
      if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 20) {
        return res.status(400).json({
          success: false,
          message: 'Limit must be a number between 1 and 20',
        });
      }

      const topCategories = await this.dashboardService.getTopCategories(
        user, 
        type as RecordType, 
        limitNumber
      );

      res.status(200).json({
        success: true,
        message: `Top ${type} categories retrieved successfully`,
        data: topCategories,
      });
    } catch (error) {
      next(error);
    }
  };
}
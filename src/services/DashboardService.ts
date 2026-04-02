import { AppDataSource } from '../config/database';
import { FinancialRecord, RecordType, RecordCategory } from '../entities/FinancialRecord';
import { User } from '../entities/User';

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recordCount: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  recentActivity: FinancialRecord[];
}

export interface CategoryBreakdown {
  category: RecordCategory;
  type: RecordType;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export class DashboardService {
  private recordRepository = AppDataSource.getRepository(FinancialRecord);

  async getDashboardSummary(user: User, startDate?: Date, endDate?: Date): Promise<DashboardSummary> {
    const whereConditions: any = {
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    // Apply date filter if provided
    if (startDate && endDate) {
      whereConditions.date = Between(startDate, endDate);
    }

    // Get all records for calculations
    const records = await this.recordRepository.find({
      where: whereConditions,
      relations: ['createdBy'],
      order: { date: 'DESC' },
    });

    // Calculate totals
    const totalIncome = records
      .filter(r => r.type === RecordType.INCOME)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpenses = records
      .filter(r => r.type === RecordType.EXPENSE)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    // Get category breakdown
    const categoryBreakdown = this.calculateCategoryBreakdown(records, totalIncome + totalExpenses);

    // Get monthly trends (last 12 months)
    const monthlyTrends = this.calculateMonthlyTrends(records);

    // Get recent activity (last 10 records)
    const recentActivity = records.slice(0, 10);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      recordCount: records.length,
      categoryBreakdown,
      monthlyTrends,
      recentActivity,
    };
  }

  async getIncomeVsExpenses(user: User, period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const whereConditions: any = {
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    whereConditions.date = MoreThanOrEqual(startDate);

    const records = await this.recordRepository.find({
      where: whereConditions,
    });

    const income = records
      .filter(r => r.type === RecordType.INCOME)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const expenses = records
      .filter(r => r.type === RecordType.EXPENSE)
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      period,
      income,
      expenses,
      net: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
  }

  async getCategoryAnalysis(user: User, type?: RecordType): Promise<CategoryBreakdown[]> {
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

    const records = await this.recordRepository.find({
      where: whereConditions,
    });

    const totalAmount = records.reduce((sum, r) => sum + Number(r.amount), 0);

    return this.calculateCategoryBreakdown(records, totalAmount);
  }

  async getMonthlyComparison(user: User, months: number = 6): Promise<MonthlyTrend[]> {
    const whereConditions: any = {
      isDeleted: false,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    // Get records from the last N months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    whereConditions.date = MoreThanOrEqual(startDate);

    const records = await this.recordRepository.find({
      where: whereConditions,
      order: { date: 'ASC' },
    });

    return this.calculateMonthlyTrends(records, months);
  }

  async getTopCategories(user: User, type: RecordType, limit: number = 5): Promise<CategoryBreakdown[]> {
    const whereConditions: any = {
      isDeleted: false,
      type,
    };

    // Apply access control
    if (!user.canViewAllRecords) {
      whereConditions.createdBy = { id: user.id };
    }

    const records = await this.recordRepository.find({
      where: whereConditions,
    });

    const categoryBreakdown = this.calculateCategoryBreakdown(records, 0);
    
    return categoryBreakdown
      .filter(cb => cb.type === type)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  private calculateCategoryBreakdown(records: FinancialRecord[], totalAmount: number): CategoryBreakdown[] {
    const categoryMap = new Map<string, { total: number; count: number; type: RecordType }>();

    records.forEach(record => {
      const key = `${record.category}-${record.type}`;
      const existing = categoryMap.get(key) || { total: 0, count: 0, type: record.type };
      
      categoryMap.set(key, {
        total: existing.total + Number(record.amount),
        count: existing.count + 1,
        type: record.type,
      });
    });

    return Array.from(categoryMap.entries()).map(([key, data]) => {
      const [category] = key.split('-');
      return {
        category: category as RecordCategory,
        type: data.type,
        total: data.total,
        count: data.count,
        percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
      };
    }).sort((a, b) => b.total - a.total);
  }

  private calculateMonthlyTrends(records: FinancialRecord[], months: number = 12): MonthlyTrend[] {
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    // Initialize last N months
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
      monthlyData.set(monthKey, { income: 0, expenses: 0 });
    }

    // Aggregate records by month
    records.forEach(record => {
      const monthKey = record.monthYear;
      const existing = monthlyData.get(monthKey);
      
      if (existing) {
        if (record.type === RecordType.INCOME) {
          existing.income += Number(record.amount);
        } else {
          existing.expenses += Number(record.amount);
        }
      }
    });

    // Convert to array and calculate net
    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    })).sort((a, b) => a.month.localeCompare(b.month));
  }
}
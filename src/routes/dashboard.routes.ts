import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get dashboard summary with totals and trends
 * @access  Private
 */
router.get('/summary', 
  authenticate, 
  dashboardController.getDashboardSummary
);

/**
 * @route   GET /api/dashboard/income-vs-expenses
 * @desc    Get income vs expenses comparison
 * @access  Private
 */
router.get('/income-vs-expenses', 
  authenticate, 
  dashboardController.getIncomeVsExpenses
);

/**
 * @route   GET /api/dashboard/category-analysis
 * @desc    Get category-wise analysis
 * @access  Private
 */
router.get('/category-analysis', 
  authenticate, 
  dashboardController.getCategoryAnalysis
);

/**
 * @route   GET /api/dashboard/monthly-trends
 * @desc    Get monthly trends comparison
 * @access  Private
 */
router.get('/monthly-trends', 
  authenticate, 
  dashboardController.getMonthlyComparison
);

/**
 * @route   GET /api/dashboard/top-categories/:type
 * @desc    Get top categories by type (income/expense)
 * @access  Private
 */
router.get('/top-categories/:type', 
  authenticate, 
  dashboardController.getTopCategories
);

export default router;
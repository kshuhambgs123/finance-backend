import { Router } from 'express';
import { RecordController } from '../controllers/RecordController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateRecordDto, UpdateRecordDto, RecordQueryDto } from '../dto/record.dto';
import { UserRole } from '../entities/User';

const router = Router();
const recordController = new RecordController();

/**
 * @route   POST /api/records
 * @desc    Create a new financial record
 * @access  Private (Admin, Analyst)
 */
router.post('/', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.ANALYST), 
  validateBody(CreateRecordDto), 
  recordController.createRecord
);

/**
 * @route   GET /api/records
 * @desc    Get financial records with pagination and filtering
 * @access  Private
 */
router.get('/', 
  authenticate, 
  validateQuery(RecordQueryDto), 
  recordController.getRecords
);

/**
 * @route   GET /api/records/:id
 * @desc    Get financial record by ID
 * @access  Private
 */
router.get('/:id', 
  authenticate, 
  recordController.getRecordById
);

/**
 * @route   PUT /api/records/:id
 * @desc    Update financial record
 * @access  Private (Record owner or Admin)
 */
router.put('/:id', 
  authenticate, 
  validateBody(UpdateRecordDto), 
  recordController.updateRecord
);

/**
 * @route   DELETE /api/records/:id
 * @desc    Delete financial record
 * @access  Private (Record owner or Admin)
 */
router.delete('/:id', 
  authenticate, 
  recordController.deleteRecord
);

/**
 * @route   POST /api/records/bulk-delete
 * @desc    Bulk delete financial records
 * @access  Private (Admin only)
 */
router.post('/bulk-delete', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  recordController.bulkDeleteRecords
);

/**
 * @route   GET /api/records/category/:category
 * @desc    Get records by category
 * @access  Private
 */
router.get('/category/:category', 
  authenticate, 
  recordController.getRecordsByCategory
);

export default router;
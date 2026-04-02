import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../dto/user.dto';
import { UserRole } from '../entities/User';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin only)
 * @access  Private (Admin)
 */
router.post('/', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  validateBody(CreateUserDto), 
  userController.createUser
);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin, Analyst)
 */
router.get('/', 
  authenticate, 
  authorize(UserRole.ADMIN, UserRole.ANALYST), 
  validateQuery(UserQueryDto), 
  userController.getUsers
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin)
 */
router.get('/stats', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  userController.getUserStats
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Own profile or Admin/Analyst)
 */
router.get('/:id', 
  authenticate, 
  userController.getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put('/:id', 
  authenticate, 
  validateBody(UpdateUserDto), 
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', 
  authenticate, 
  authorize(UserRole.ADMIN), 
  userController.deleteUser
);

export default router;
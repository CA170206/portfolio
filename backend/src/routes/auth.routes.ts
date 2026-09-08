import { Router } from 'express';
import { loginController, getMeController } from '../controllers/auth.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and return JWT token
 * @access  Public
 */
router.post('/login', loginController);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated admin profile
 * @access  Private (Admin token required)
 */
router.get('/me', authenticateAdmin, getMeController);

export default router;

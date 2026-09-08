import { Router } from 'express';
import {
  getLinkedinController,
  updateLinkedinController,
  getPublicLinkedinController,
} from '../controllers/linkedin.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route for portfolio frontend
router.get('/public', getPublicLinkedinController);

// Admin protected routes
router.get('/', authenticateAdmin, getLinkedinController);
router.put('/', authenticateAdmin, updateLinkedinController);

export default router;

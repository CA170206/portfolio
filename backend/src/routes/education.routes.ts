import { Router } from 'express';
import {
  getAllEducationsController,
  getEducationByIdController,
  createEducationController,
  updateEducationController,
  deleteEducationController,
  getPublicEducationsController,
} from '../controllers/education.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/public', getPublicEducationsController);

// Protected routes
router.get('/', authenticateAdmin, getAllEducationsController);
router.get('/:id', authenticateAdmin, getEducationByIdController);
router.post('/', authenticateAdmin, createEducationController);
router.put('/:id', authenticateAdmin, updateEducationController);
router.delete('/:id', authenticateAdmin, deleteEducationController);

export default router;

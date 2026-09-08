import { Router } from 'express';
import {
  getAllExperiencesController,
  getExperienceByIdController,
  createExperienceController,
  updateExperienceController,
  deleteExperienceController,
  getPublicExperiencesController,
} from '../controllers/experience.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/public', getPublicExperiencesController);

// Protected routes
router.get('/', authenticateAdmin, getAllExperiencesController);
router.get('/:id', authenticateAdmin, getExperienceByIdController);
router.post('/', authenticateAdmin, createExperienceController);
router.put('/:id', authenticateAdmin, updateExperienceController);
router.delete('/:id', authenticateAdmin, deleteExperienceController);

export default router;

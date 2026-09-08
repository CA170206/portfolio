import { Router } from 'express';
import {
  getAllSkillsController,
  getSkillByIdController,
  createSkillController,
  updateSkillController,
  deleteSkillController,
  getPublicSkillsController,
} from '../controllers/skill.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/public', getPublicSkillsController);

// Protected routes
router.get('/', authenticateAdmin, getAllSkillsController);
router.get('/:id', authenticateAdmin, getSkillByIdController);
router.post('/', authenticateAdmin, createSkillController);
router.put('/:id', authenticateAdmin, updateSkillController);
router.delete('/:id', authenticateAdmin, deleteSkillController);

export default router;

import { Router } from 'express';
import {
  getGithubController,
  updateGithubController,
  syncGithubController,
  getPublicGithubController,
} from '../controllers/github.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route for public portfolio
router.get('/public', getPublicGithubController);

// Admin protected routes
router.get('/', authenticateAdmin, getGithubController);
router.put('/', authenticateAdmin, updateGithubController);
router.post('/sync', authenticateAdmin, syncGithubController);

export default router;

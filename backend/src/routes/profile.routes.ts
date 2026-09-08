import { Router } from 'express';
import {
  getProfileController,
  createProfileController,
  updateProfileController,
  deleteProfileController,
  getPublicProfileController,
} from '../controllers/profile.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route (unauthenticated)
router.get('/public', getPublicProfileController);

// Admin protected routes
router.get('/', authenticateAdmin, getProfileController);
router.post('/', authenticateAdmin, createProfileController);
router.put('/', authenticateAdmin, updateProfileController);
router.put('/:id', authenticateAdmin, updateProfileController);
router.delete('/', authenticateAdmin, deleteProfileController);
router.delete('/:id', authenticateAdmin, deleteProfileController);

export default router;

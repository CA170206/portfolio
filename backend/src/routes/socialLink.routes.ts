import { Router } from 'express';
import {
  getAllSocialLinksController,
  getSocialLinkByIdController,
  createSocialLinkController,
  updateSocialLinkController,
  deleteSocialLinkController,
  getPublicSocialLinksController,
} from '../controllers/socialLink.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/public', getPublicSocialLinksController);

// Protected routes
router.get('/', authenticateAdmin, getAllSocialLinksController);
router.get('/:id', authenticateAdmin, getSocialLinkByIdController);
router.post('/', authenticateAdmin, createSocialLinkController);
router.put('/:id', authenticateAdmin, updateSocialLinkController);
router.delete('/:id', authenticateAdmin, deleteSocialLinkController);

export default router;

import { Router } from 'express';
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
  getPublicProjectsController,
  getProjectImagesController,
  addProjectImageController,
  updateProjectImageController,
  deleteProjectImageController,
} from '../controllers/project.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/public', getPublicProjectsController);

// Protected Project CRUD
router.get('/', authenticateAdmin, getAllProjectsController);
router.get('/:id', authenticateAdmin, getProjectByIdController);
router.post('/', authenticateAdmin, createProjectController);
router.put('/:id', authenticateAdmin, updateProjectController);
router.delete('/:id', authenticateAdmin, deleteProjectController);

// Project Images routes
router.get('/:projectId/images', authenticateAdmin, getProjectImagesController);
router.post('/:projectId/images', authenticateAdmin, addProjectImageController);
router.put('/:projectId/images/:imageId', authenticateAdmin, updateProjectImageController);
router.delete('/:projectId/images/:imageId', authenticateAdmin, deleteProjectImageController);

export default router;

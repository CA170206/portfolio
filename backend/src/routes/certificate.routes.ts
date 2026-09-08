import { Router } from 'express';
import {
  getAllCertificatesController,
  getCertificateByIdController,
  createCertificateController,
  updateCertificateController,
  deleteCertificateController,
  getPublicCertificatesController,
} from '../controllers/certificate.controller';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/public', getPublicCertificatesController);

// Protected routes
router.get('/', authenticateAdmin, getAllCertificatesController);
router.get('/:id', authenticateAdmin, getCertificateByIdController);
router.post('/', authenticateAdmin, createCertificateController);
router.put('/:id', authenticateAdmin, updateCertificateController);
router.delete('/:id', authenticateAdmin, deleteCertificateController);

export default router;

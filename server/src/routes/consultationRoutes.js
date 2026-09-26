import express from 'express';
import {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createConsultation);
router.get('/', protect, authorizeRoles('admin'), getConsultations);
router.get('/:id', protect, authorizeRoles('admin'), getConsultationById);
router.patch('/:id', protect, authorizeRoles('admin'), updateConsultation);
router.delete('/:id', protect, authorizeRoles('admin'), deleteConsultation);

export default router;

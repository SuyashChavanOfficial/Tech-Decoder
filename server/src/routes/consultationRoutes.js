import express from 'express';
import { createConsultation } from '../controllers/consultationController.js';

const router = express.Router();

router.post('/', createConsultation);

export default router;

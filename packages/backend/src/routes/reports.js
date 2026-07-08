import express from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', authMiddleware, createReport);
router.put('/:id', authMiddleware, updateReport);
router.delete('/:id', authMiddleware, deleteReport);

export default router;
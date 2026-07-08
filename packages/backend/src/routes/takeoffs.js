import express from 'express';
import multer from 'multer';
import {
  analyzeTakeoff,
  getAllTakeoffs,
  getTakeoffById,
  updateTakeoff,
  deleteTakeoff,
  exportTakeoffExcel,
} from '../controllers/takeoffController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const maxMb = Number(process.env.MAX_UPLOAD_MB || 25);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxMb * 1024 * 1024 },
});

router.get('/', getAllTakeoffs);
router.get('/:id', getTakeoffById);
router.get('/:id/excel', exportTakeoffExcel);
router.post('/analyze', authMiddleware, upload.single('file'), analyzeTakeoff);
router.put('/:id', authMiddleware, updateTakeoff);
router.delete('/:id', authMiddleware, deleteTakeoff);

export default router;

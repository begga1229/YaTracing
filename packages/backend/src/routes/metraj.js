import express from 'express';
import multer from 'multer';
import { analyzePublic, concreteExcel } from '../controllers/metrajServiceController.js';

const router = express.Router();

const maxMb = Number(process.env.MAX_UPLOAD_MB || 25);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxMb * 1024 * 1024 },
});

// Durumsuz, kimlik dogrulama gerektirmeyen public metraj uclari
router.post('/analyze', upload.single('file'), analyzePublic);
router.post('/concrete-excel', concreteExcel);

export default router;

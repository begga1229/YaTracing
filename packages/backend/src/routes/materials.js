import express from 'express';
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '../controllers/materialController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', authMiddleware, createMaterial);
router.put('/:id', authMiddleware, updateMaterial);
router.delete('/:id', authMiddleware, deleteMaterial);

export default router;
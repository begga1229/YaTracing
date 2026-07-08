import express from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', authMiddleware, createEquipment);
router.put('/:id', authMiddleware, updateEquipment);
router.delete('/:id', authMiddleware, deleteEquipment);

export default router;
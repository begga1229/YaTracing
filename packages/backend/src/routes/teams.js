import express from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/teamController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', authMiddleware, createTeam);
router.put('/:id', authMiddleware, updateTeam);
router.delete('/:id', authMiddleware, deleteTeam);

export default router;
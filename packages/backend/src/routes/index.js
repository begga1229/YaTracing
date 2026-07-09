import express from 'express';
import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import teamRoutes from './teams.js';
import materialRoutes from './materials.js';
import equipmentRoutes from './equipment.js';
import reportRoutes from './reports.js';
import takeoffRoutes from './takeoffs.js';
import metrajRoutes from './metraj.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/teams', teamRoutes);
router.use('/materials', materialRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/reports', reportRoutes);
router.use('/takeoffs', takeoffRoutes);
router.use('/metraj', metrajRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

export default router;
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert
} from '../controllers/alertController';

const router = Router();

router.get('/', authenticateToken, getAllAlerts);
router.get('/:id', authenticateToken, getAlertById);
router.post('/', authenticateToken, createAlert);
router.put('/:id', authenticateToken, updateAlert);
router.delete('/:id', authenticateToken, deleteAlert);

export default router;

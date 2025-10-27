import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getAllBatteries,
  getBatteryById,
  createBattery,
  updateBattery,
  deleteBattery
} from '../controllers/batteryController';

const router = Router();

router.get('/', authenticateToken, getAllBatteries);
router.get('/:id', authenticateToken, getBatteryById);
router.post('/', authenticateToken, createBattery);
router.put('/:id', authenticateToken, updateBattery);
router.delete('/:id', authenticateToken, deleteBattery);

export default router;

import { Router } from 'express';
import {
  getAllBatteries,
  getBatteryById,
  createBattery,
  updateBattery,
  deleteBattery
} from '../controllers/batteryController';

const router = Router();

router.get('/', getAllBatteries);
router.get('/:id', getBatteryById);
router.post('/', createBattery);
router.put('/:id', updateBattery);
router.delete('/:id', deleteBattery);

export default router;

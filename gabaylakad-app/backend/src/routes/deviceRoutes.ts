import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceBySerial
} from '../controllers/deviceController';

const router = Router();


router.get('/', authenticateToken, getAllDevices);
router.get('/serial/:serial_number', authenticateToken, getDeviceBySerial);
router.get('/:id', authenticateToken, getDeviceById);
router.post('/', authenticateToken, createDevice);
router.put('/:id', authenticateToken, updateDevice);
router.delete('/:id', authenticateToken, deleteDevice);

export default router;

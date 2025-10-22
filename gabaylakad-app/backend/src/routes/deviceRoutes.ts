import { Router } from 'express';
import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceBySerial
} from '../controllers/deviceController';

const router = Router();


router.get('/', getAllDevices);
router.get('/serial/:serial_number', getDeviceBySerial);
router.get('/:id', getDeviceById);
router.post('/', createDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;

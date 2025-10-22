import { Router } from 'express';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationHistory,
  getLocationHistoryBySerial
} from '../controllers/locationController';

const router = Router();


router.get('/', getAllLocations);
router.get('/history/serial/:serial_number', getLocationHistoryBySerial);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);
router.get('/history/:device_id', getLocationHistory);

export default router;

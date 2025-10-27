import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
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


router.get('/', authenticateToken, getAllLocations);
router.get('/history/serial/:serial_number', authenticateToken, getLocationHistoryBySerial);
router.get('/:id', authenticateToken, getLocationById);
router.post('/', authenticateToken, createLocation);
router.put('/:id', authenticateToken, updateLocation);
router.delete('/:id', authenticateToken, deleteLocation);
router.get('/history/:device_id', authenticateToken, getLocationHistory);

export default router;

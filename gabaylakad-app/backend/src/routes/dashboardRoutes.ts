import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getDashboardData,
  getDeviceStatus,
  getBatteryLevels,
  getRecentAlerts,
  getReflectorStatus,
  getActivitySummary
} from '../controllers/dashboardController';

const router = Router();


// Existing routes
router.get('/', getDashboardData);
router.get('/devices/:id/status', getDeviceStatus);
router.get('/battery', getBatteryLevels);
router.get('/alerts', getRecentAlerts);
router.get('/reflectors', getReflectorStatus);
router.get('/activity', getActivitySummary);

// New dashboard card endpoints

import {
  getEmergencyStatus,
  getNightReflectorStatus,
  getActivityLog,
  getLocationData,
  getSensorLog
} from '../controllers/dashboardController';

router.get('/emergency', authenticateToken, getEmergencyStatus);
router.get('/nightreflector', authenticateToken, getNightReflectorStatus);
router.get('/activitylog', authenticateToken, getActivityLog);
router.get('/location', authenticateToken, getLocationData);

// New: Sensor log endpoint for dashboard
router.get('/sensor', authenticateToken, getSensorLog);


import { getDeviceInfo } from '../controllers/locationController';
import { getDashboardDeviceBySerial } from '../controllers/dashboardController';
router.get('/device/:deviceId', authenticateToken, getDeviceInfo);
router.get('/device/serial/:serial_number', authenticateToken, getDashboardDeviceBySerial);

export default router;

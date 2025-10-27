import { getAllDevices } from '../controllers/dashboardController';

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

router.get('/device', authenticateToken, getAllDevices);
router.get('/', authenticateToken, getDashboardData);
router.get('/devices/:id/status', authenticateToken, getDeviceStatus);
router.get('/battery', authenticateToken, getBatteryLevels);
router.get('/alerts', authenticateToken, getRecentAlerts);
router.get('/reflectors', authenticateToken, getReflectorStatus);
router.get('/activity', authenticateToken, getActivitySummary);

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


import { getDeviceInfo, getDeviceInfoById } from '../controllers/locationController';
import { getDashboardDeviceBySerial } from '../controllers/dashboardController';
// New: Allow fetching device info for any deviceId (admin/flexible)
router.get('/device/:deviceId', authenticateToken, getDeviceInfoById);
router.get('/device/serial/:serial_number', authenticateToken, getDashboardDeviceBySerial);

export default router;

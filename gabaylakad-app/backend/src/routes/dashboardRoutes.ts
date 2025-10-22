import { Router } from 'express';
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
router.get('/devices', getDeviceStatus);
router.get('/battery', getBatteryLevels);
router.get('/alerts', getRecentAlerts);
router.get('/reflectors', getReflectorStatus);
router.get('/activity', getActivitySummary);

// New dashboard card endpoints
import {
  getEmergencyStatus,
  getNightReflectorStatus,
  getActivityLog,
  getLocationData
} from '../controllers/dashboardController';

router.get('/emergency', getEmergencyStatus);
router.get('/nightreflector', getNightReflectorStatus);
router.get('/activitylog', getActivityLog);
router.get('/location', getLocationData);


import { getDeviceInfo } from '../controllers/locationController';
import { getDashboardDeviceBySerial } from '../controllers/dashboardController';
router.get('/device/:deviceId', getDeviceInfo);
router.get('/device/serial/:serial_number', getDashboardDeviceBySerial);

export default router;

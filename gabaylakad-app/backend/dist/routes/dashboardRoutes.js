"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboardController_1 = require("../controllers/dashboardController");
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const dashboardController_2 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/device', authMiddleware_1.authenticateToken, dashboardController_1.getAllDevices);
router.get('/', authMiddleware_1.authenticateToken, dashboardController_2.getDashboardData);
router.get('/devices/:id/status', authMiddleware_1.authenticateToken, dashboardController_2.getDeviceStatus);
router.get('/battery', authMiddleware_1.authenticateToken, dashboardController_2.getBatteryLevels);
router.get('/alerts', authMiddleware_1.authenticateToken, dashboardController_2.getRecentAlerts);
router.get('/reflectors', authMiddleware_1.authenticateToken, dashboardController_2.getReflectorStatus);
router.get('/activity', authMiddleware_1.authenticateToken, dashboardController_2.getActivitySummary);
const dashboardController_3 = require("../controllers/dashboardController");
router.get('/emergency', authMiddleware_1.authenticateToken, dashboardController_3.getEmergencyStatus);
router.get('/nightreflector', authMiddleware_1.authenticateToken, dashboardController_3.getNightReflectorStatus);
router.get('/activitylog', authMiddleware_1.authenticateToken, dashboardController_3.getActivityLog);
router.get('/location', authMiddleware_1.authenticateToken, dashboardController_3.getLocationData);
// New: Sensor log endpoint for dashboard
router.get('/sensor', authMiddleware_1.authenticateToken, dashboardController_3.getSensorLog);
const locationController_1 = require("../controllers/locationController");
const dashboardController_4 = require("../controllers/dashboardController");
// New: Allow fetching device info for any deviceId (admin/flexible)
router.get('/device/:deviceId', authMiddleware_1.authenticateToken, locationController_1.getDeviceInfoById);
router.get('/device/serial/:serial_number', authMiddleware_1.authenticateToken, dashboardController_4.getDashboardDeviceBySerial);
exports.default = router;

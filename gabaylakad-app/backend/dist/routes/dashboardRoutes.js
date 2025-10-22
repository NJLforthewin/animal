"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
// Existing routes
router.get('/', dashboardController_1.getDashboardData);
router.get('/devices', dashboardController_1.getDeviceStatus);
router.get('/battery', dashboardController_1.getBatteryLevels);
router.get('/alerts', dashboardController_1.getRecentAlerts);
router.get('/reflectors', dashboardController_1.getReflectorStatus);
router.get('/activity', dashboardController_1.getActivitySummary);
// New dashboard card endpoints
const dashboardController_2 = require("../controllers/dashboardController");
router.get('/emergency', dashboardController_2.getEmergencyStatus);
router.get('/nightreflector', dashboardController_2.getNightReflectorStatus);
router.get('/activitylog', dashboardController_2.getActivityLog);
router.get('/location', dashboardController_2.getLocationData);
const dashboardController_3 = require("../controllers/dashboardController");
router.get('/device/:id', dashboardController_3.getDeviceInfo);
exports.default = router;

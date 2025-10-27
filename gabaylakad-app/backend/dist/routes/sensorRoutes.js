"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const sensorController_1 = require("../controllers/sensorController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticateToken, sensorController_1.getSensorData);
exports.default = router;

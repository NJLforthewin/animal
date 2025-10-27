import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getSensorData } from '../controllers/sensorController';

const router = Router();

router.get('/', authenticateToken, getSensorData);

export default router;
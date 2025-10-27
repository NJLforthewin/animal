import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getAllReflectors,
  getReflectorById,
  createReflector,
  updateReflector,
  deleteReflector
} from '../controllers/reflectorController';

const router = Router();

router.get('/', authenticateToken, getAllReflectors);
router.get('/:id', authenticateToken, getReflectorById);
router.post('/', authenticateToken, createReflector);
router.put('/:id', authenticateToken, updateReflector);
router.delete('/:id', authenticateToken, deleteReflector);

export default router;

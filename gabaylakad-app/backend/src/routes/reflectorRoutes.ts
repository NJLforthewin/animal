import { Router } from 'express';
import {
  getAllReflectors,
  getReflectorById,
  createReflector,
  updateReflector,
  deleteReflector
} from '../controllers/reflectorController';

const router = Router();

router.get('/', getAllReflectors);
router.get('/:id', getReflectorById);
router.post('/', createReflector);
router.put('/:id', updateReflector);
router.delete('/:id', deleteReflector);

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllGoods,
  getGoodById,
  createGood,
  updateGood,
  deleteGood,
} from '../controllers/goods.js';

const router = Router();

router.get('/', authenticate, getAllGoods);
router.get('/:id', authenticate, getGoodById);
router.post('/', authenticate, authorize('admin', 'staff'), createGood);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateGood);
router.delete('/:id', authenticate, authorize('admin'), deleteGood);

export default router;
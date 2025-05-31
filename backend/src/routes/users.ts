import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';

const router = Router();

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.post('/', authenticate, authorize('admin'), createUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
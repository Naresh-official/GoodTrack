import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getLogs } from '../controllers/logs.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'staff'), getLogs);

export default router;
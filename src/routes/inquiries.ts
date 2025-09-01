import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { inquiries: [] }
  });
}));

export { router as inquiryRoutes };
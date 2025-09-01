import { Router } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

router.get('/', asyncHandler(async (req, res) => {
  const materials = await prisma.material.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: { materials }
  });
}));

export { router as materialRoutes };
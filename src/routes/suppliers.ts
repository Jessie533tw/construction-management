import { Router } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.use(authenticateToken);

// 獲取廠商列表
router.get('/', asyncHandler(async (req, res) => {
  const suppliers = await prisma.supplier.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: { suppliers }
  });
}));

export { router as supplierRoutes };
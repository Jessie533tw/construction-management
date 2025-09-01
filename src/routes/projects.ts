import { Router } from 'express';
import { prisma } from '../index';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// 所有路由都需要認證
router.use(authenticateToken);

// 獲取專案列表
router.get('/', asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      createdBy: {
        select: { id: true, name: true, username: true }
      },
      manager: {
        select: { id: true, name: true, username: true }
      },
      _count: {
        select: {
          budgets: true,
          inquiries: true,
          purchaseOrders: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    data: { projects }
  });
}));

// 創建專案
router.post('/', requireRole('ADMIN', 'MANAGER'), asyncHandler(async (req, res) => {
  // 基本實現 - 後續完善
  res.json({
    success: true,
    message: '專案創建功能開發中'
  });
}));

export { router as projectRoutes };
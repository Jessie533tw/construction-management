import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { createError } from './errorHandler';

// 擴展 Request 類型以包含 user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        name: string;
        role: string;
        department?: string;
      };
    }
  }
}

export interface JWTPayload {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  department?: string;
}

// JWT 認證中間件
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('未提供認證令牌', 401, 'MISSING_TOKEN');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw createError('JWT 密鑰未配置', 500, 'JWT_SECRET_MISSING');
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // 驗證用戶是否仍然存在且為活躍狀態
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        department: true,
      },
    });

    if (!user) {
      throw createError('用戶不存在或已被停用', 401, 'USER_NOT_FOUND');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error instanceof jwt.TokenExpiredError) {
        next(createError('認證令牌已過期', 401, 'TOKEN_EXPIRED'));
      } else {
        next(createError('無效的認證令牌', 401, 'INVALID_TOKEN'));
      }
    } else {
      next(error);
    }
  }
};

// 角色權限檢查中間件
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('用戶未認證', 401, 'USER_NOT_AUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('權限不足', 403, 'INSUFFICIENT_PERMISSION'));
    }

    next();
  };
};

// 管理員權限檢查
export const requireAdmin = requireRole('ADMIN');

// 主管權限檢查 (主管或管理員)
export const requireSupervisor = requireRole('ADMIN', 'SUPERVISOR', 'MANAGER');

// 會計權限檢查
export const requireAccountant = requireRole('ADMIN', 'ACCOUNTANT');

// 可選的認證中間件 (某些端點可能不需要認證)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        department: true,
      },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // 對於可選認證，我們忽略認證錯誤
    next();
  }
};

// 專案訪問權限檢查 (用戶必須是專案的創建者或管理者)
export const requireProjectAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError('用戶未認證', 401, 'USER_NOT_AUTHENTICATED'));
    }

    // 管理員可以訪問所有專案
    if (req.user.role === 'ADMIN') {
      return next();
    }

    const projectId = req.params.projectId || req.body.projectId;
    if (!projectId) {
      return next(createError('專案 ID 未提供', 400, 'PROJECT_ID_MISSING'));
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { createdById: req.user.id },
          { managerId: req.user.id },
        ],
      },
    });

    if (!project) {
      return next(createError('無權訪問此專案', 403, 'PROJECT_ACCESS_DENIED'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: AppError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = '內部服務器錯誤';
  let code = 'INTERNAL_ERROR';

  // Prisma 錯誤處理
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = '資料重複，違反唯一性約束';
        code = 'DUPLICATE_ERROR';
        break;
      case 'P2025':
        statusCode = 404;
        message = '找不到相關記錄';
        code = 'NOT_FOUND';
        break;
      case 'P2003':
        statusCode = 400;
        message = '外鍵約束失敗';
        code = 'FOREIGN_KEY_ERROR';
        break;
      case 'P2014':
        statusCode = 400;
        message = '資料關聯衝突';
        code = 'RELATION_ERROR';
        break;
      default:
        statusCode = 500;
        message = '資料庫操作錯誤';
        code = 'DATABASE_ERROR';
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = '資料驗證錯誤';
    code = 'VALIDATION_ERROR';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'APP_ERROR';
  }

  // 記錄錯誤 (生產環境應該使用適當的日誌系統)
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    error: error.message,
    stack: error.stack,
    statusCode,
    code,
    userId: req.user?.id || 'anonymous',
  });

  // 開發環境返回詳細錯誤信息
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(isDevelopment && {
        stack: error.stack,
        details: error,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

// 異步錯誤包裝器
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 創建自定義錯誤
export const createError = (message: string, statusCode: number, code?: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};
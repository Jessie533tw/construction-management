import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// 驗證 schema
const registerSchema = z.object({
  email: z.string().email('無效的電子郵件格式'),
  username: z.string().min(3, '用戶名至少需要 3 個字符').max(50, '用戶名不能超過 50 個字符'),
  password: z.string().min(6, '密碼至少需要 6 個字符').max(100, '密碼不能超過 100 個字符'),
  name: z.string().min(1, '姓名不能為空').max(100, '姓名不能超過 100 個字符'),
  department: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1, '請輸入用戶名或電子郵件'),
  password: z.string().min(1, '請輸入密碼'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入當前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要 6 個字符').max(100, '新密碼不能超過 100 個字符'),
});

// 生成 JWT token
const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError('JWT 密鑰未配置', 500, 'JWT_SECRET_MISSING');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// 註冊
router.post('/register', asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  
  // 檢查用戶名和信箱是否已存在
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === validatedData.email) {
      throw createError('此電子郵件已被註冊', 409, 'EMAIL_EXISTS');
    } else {
      throw createError('此用戶名已被使用', 409, 'USERNAME_EXISTS');
    }
  }

  // 加密密碼
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

  // 創建用戶
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      name: validatedData.name,
      department: validatedData.department,
      phone: validatedData.phone,
      role: 'STAFF', // 默認為一般員工
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      department: true,
      phone: true,
      createdAt: true,
    },
  });

  // 生成 token
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department,
  });

  res.status(201).json({
    success: true,
    message: '註冊成功',
    data: {
      user,
      token,
    },
  });
}));

// 登入
router.post('/login', asyncHandler(async (req, res) => {
  const { identifier, password } = loginSchema.parse(req.body);

  // 查找用戶 (通過用戶名或電子郵件)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
      isActive: true,
    },
  });

  if (!user) {
    throw createError('用戶名/電子郵件或密碼錯誤', 401, 'INVALID_CREDENTIALS');
  }

  // 驗證密碼
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('用戶名/電子郵件或密碼錯誤', 401, 'INVALID_CREDENTIALS');
  }

  // 生成 token
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department,
  });

  // 更新最後登入時間 (可選)
  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() },
  });

  const userResponse = {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department,
    phone: user.phone,
    createdAt: user.createdAt,
  };

  res.json({
    success: true,
    message: '登入成功',
    data: {
      user: userResponse,
      token,
    },
  });
}));

// 獲取當前用戶資訊
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      department: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw createError('用戶不存在', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: { user },
  });
}));

// 更新用戶資訊
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const updateSchema = z.object({
    name: z.string().min(1, '姓名不能為空').max(100, '姓名不能超過 100 個字符').optional(),
    department: z.string().optional(),
    phone: z.string().optional(),
  });

  const validatedData = updateSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: validatedData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      department: true,
      phone: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: '個人資料更新成功',
    data: { user },
  });
}));

// 修改密碼
router.put('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  // 獲取用戶當前密碼
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { password: true },
  });

  if (!user) {
    throw createError('用戶不存在', 404, 'USER_NOT_FOUND');
  }

  // 驗證當前密碼
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw createError('當前密碼錯誤', 400, 'INVALID_CURRENT_PASSWORD');
  }

  // 加密新密碼
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // 更新密碼
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { password: hashedNewPassword },
  });

  res.json({
    success: true,
    message: '密碼修改成功',
  });
}));

// 刷新 token
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  const token = generateToken({
    id: req.user!.id,
    email: req.user!.email,
    username: req.user!.username,
    name: req.user!.name,
    role: req.user!.role,
    department: req.user!.department,
  });

  res.json({
    success: true,
    message: 'Token 刷新成功',
    data: { token },
  });
}));

// 登出 (前端處理，後端只需要回應成功)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '登出成功',
  });
});

export { router as authRoutes };
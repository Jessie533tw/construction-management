import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { supplierRoutes } from './routes/suppliers';
import { materialRoutes } from './routes/materials';
import { inquiryRoutes } from './routes/inquiries';
import { purchaseRoutes } from './routes/purchases';
import { progressRoutes } from './routes/progress';
import { reportRoutes } from './routes/reports';
import { notificationRoutes } from './routes/notifications';

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 初始化 Prisma 客戶端
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 確保上傳資料夾存在
const uploadPath = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// 安全性中間件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 每個 IP 最多 100 個請求
  message: {
    error: '請求過於頻繁，請稍後再試'
  }
});

app.use(limiter);

// CORS 設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing 中間件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 靜態檔案服務
app.use('/uploads', express.static(uploadPath));
app.use('/api/files', express.static(uploadPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// 服務前端靜態檔案 (生產環境)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// 錯誤處理中間件
app.use(errorHandler);

// 優雅關閉
process.on('SIGINT', async () => {
  console.log('正在關閉服務器...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('正在關閉服務器...');
  await prisma.$disconnect();
  process.exit(0);
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 服務器運行在 http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 上傳目錄: ${uploadPath}`);
  console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
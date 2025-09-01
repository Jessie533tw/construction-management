#!/bin/bash

# 資料庫設定腳本

echo "🗃️  設定資料庫..."

# 檢查 .env 文件
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，請先建立"
    exit 1
fi

# 讀取 DATABASE_URL
source .env

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL 未設定"
    exit 1
fi

echo "✅ 資料庫連接: $DATABASE_URL"

# 推送 schema 到資料庫
echo "📤 推送 Prisma schema..."
npx prisma db push

# 播種初始資料
echo "🌱 播種初始資料..."
npm run db:seed

echo "✅ 資料庫設定完成！"
echo ""
echo "🔑 預設帳戶:"
echo "  管理員: admin@construction.com / admin123"
echo "  經理: manager@construction.com / manager123"
echo "  員工: staff@construction.com / staff123"
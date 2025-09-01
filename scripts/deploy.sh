#!/bin/bash

# 建設管理系統部署腳本

echo "🚀 開始部署建設管理系統..."

# 檢查 Node.js 版本
echo "📋 檢查 Node.js 版本..."
node_version=$(node --version)
echo "Node.js 版本: $node_version"

if ! node --version | grep -q "v1[89]\|v[2-9][0-9]"; then
    echo "❌ 需要 Node.js 18 或更高版本"
    exit 1
fi

# 安裝依賴
echo "📦 安裝後端依賴..."
npm install

echo "📦 安裝前端依賴..."
cd client
npm install
cd ..

# 生成 Prisma 客戶端
echo "🔧 生成 Prisma 客戶端..."
npx prisma generate

# 建構應用程式
echo "🔨 建構後端..."
npm run build

echo "🔨 建構前端..."
npm run client:build

# 檢查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，複製範本..."
    cp .env.example .env
    echo "✅ 已建立 .env 文件，請編輯並設定相關變數"
else
    echo "✅ .env 文件已存在"
fi

echo "🎉 部署準備完成！"
echo ""
echo "📋 接下來的步驟："
echo "1. 編輯 .env 文件設定資料庫連接"
echo "2. 執行資料庫遷移: npm run db:push"
echo "3. 播種初始資料: npm run db:seed"
echo "4. 啟動應用程式: npm start"
echo ""
echo "🌐 本地開發:"
echo "  後端: npm run dev"
echo "  前端: npm run client:dev"
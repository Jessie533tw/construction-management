# 建設公司發包管理系統

一個專為建設公司設計的完整發包管理系統，涵蓋從詢價、報價比較、採購下單到進度追蹤的完整工作流程。

## 🚀 功能特色

### 核心模組

1. **專案管理模組**
   - 新建專案與自動資料夾建立
   - 預算表建立與主管審核流程
   - 工料分析表生成

2. **詢價與比價系統**
   - 詢價單生成與廠商管理
   - 報價收集與整理
   - 計價比較表自動化分析

3. **採購管理**
   - 採購單生成與預算扣除
   - 付款條件與交期管理
   - 採購單確認流程

4. **進度追蹤系統**
   - 施工進度表自動生成
   - 工程/材料採購明細表
   - 進度比對與延誤提醒

5. **自動化工作流程**
   - 成本控管與傳票生成
   - 合約編號生成與 PDF 輸出
   - 自動化通知系統
   - 完工報告彙整

## 🛠 技術架構

### 後端技術
- **框架**: Node.js + Express.js
- **資料庫**: PostgreSQL + Prisma ORM
- **認證**: JWT + bcryptjs
- **檔案處理**: Puppeteer (PDF 生成)
- **郵件服務**: Nodemailer

### 前端技術
- **框架**: React + TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: Zustand
- **表單處理**: React Hook Form + Zod
- **路由**: React Router
- **HTTP 客戶端**: Axios

### 部署
- **容器化**: Docker
- **平台**: Zeabur (支援一鍵部署)

## 📦 安裝與設定

### 環境需求
- Node.js 18+
- PostgreSQL 13+
- npm 或 yarn

### 1. 複製專案
```bash
git clone <your-repo-url>
cd construction-management
```

### 2. 安裝依賴
```bash
# 安裝後端依賴
npm install

# 安裝前端依賴
cd client && npm install
```

### 3. 環境變數設定
```bash
# 複製環境變數範本
cp .env.example .env
```

編輯 `.env` 文件：
```env
# 資料庫連接
DATABASE_URL="postgresql://username:password@localhost:5432/construction_db?schema=public"

# JWT 設定
JWT_SECRET="your-super-secret-key-here"
JWT_EXPIRES_IN="7d"

# 伺服器設定
PORT=3001
NODE_ENV="development"

# 郵件設定
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@construction.com"
FROM_NAME="建設管理系統"

# 前端 URL
FRONTEND_URL="http://localhost:3000"
```

### 4. 資料庫設定
```bash
# 生成 Prisma 客戶端
npm run db:generate

# 推送資料庫 schema
npm run db:push

# 或使用 migration（生產環境推薦）
npm run db:migrate
```

### 5. 啟動開發伺服器
```bash
# 啟動後端（在根目錄）
npm run dev

# 啟動前端（新開終端）
npm run client:dev
```

系統將在以下地址啟動：
- 前端: http://localhost:3000
- 後端 API: http://localhost:3001
- 資料庫管理: http://localhost:5555 (執行 `npm run db:studio`)

## 🐳 Docker 部署

### 本地 Docker 部署
```bash
# 建構映像
docker build -t construction-management .

# 執行容器
docker run -p 3001:3001 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  construction-management
```

### Docker Compose（含資料庫）
```bash
# 啟動完整服務
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

## ☁️ Zeabur 部署

### 1. 準備部署
1. 將程式碼推送到 GitHub repository
2. 登入 [Zeabur](https://zeabur.com)
3. 建立新專案並連接你的 GitHub repository

### 2. 設定服務
1. **資料庫服務**: 新增 PostgreSQL 服務
2. **應用服務**: 部署你的應用程式

### 3. 環境變數設定
在 Zeabur 控制台設定以下環境變數：
- `DATABASE_URL`: 使用 Zeabur 提供的 PostgreSQL 連接字串
- `JWT_SECRET`: 生產環境的 JWT 密鑰
- `NODE_ENV`: `production`
- 其他郵件和應用設定

### 4. 域名綁定
- Zeabur 會自動提供一個域名
- 可以綁定自定義域名（支援自動 HTTPS）

## 👥 使用者角色權限

| 角色 | 權限 |
|------|------|
| ADMIN | 系統管理員，擁有所有權限 |
| MANAGER | 專案經理，可管理指派的專案 |
| SUPERVISOR | 主管，可審核預算和採購 |
| STAFF | 一般員工，基本操作權限 |
| ACCOUNTANT | 會計，財務相關權限 |

## 📝 API 文檔

### 認證端點
- `POST /api/auth/login` - 使用者登入
- `POST /api/auth/register` - 使用者註冊
- `GET /api/auth/me` - 獲取當前使用者資訊
- `PUT /api/auth/profile` - 更新個人資料
- `PUT /api/auth/change-password` - 修改密碼

### 主要功能端點
- `/api/projects` - 專案管理
- `/api/suppliers` - 廠商管理
- `/api/materials` - 材料管理
- `/api/inquiries` - 詢價管理
- `/api/purchases` - 採購管理
- `/api/progress` - 進度追蹤
- `/api/reports` - 報表系統

## 🔧 開發指南

### 項目結構
```
construction-management/
├── src/                    # 後端源碼
│   ├── routes/            # API 路由
│   ├── middleware/        # 中間件
│   └── index.ts          # 主要入口
├── client/               # 前端源碼
│   ├── src/
│   │   ├── components/   # React 組件
│   │   ├── pages/       # 頁面組件
│   │   ├── store/       # 狀態管理
│   │   └── services/    # API 服務
├── prisma/              # 資料庫 schema
├── uploads/             # 檔案上傳目錄
└── docker/              # Docker 配置
```

### 開發工作流
1. 建立功能分支：`git checkout -b feature/new-feature`
2. 開發功能並測試
3. 提交代碼：`git commit -m "feat: add new feature"`
4. 推送並建立 Pull Request
5. Code Review 後合併

### 程式碼規範
- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 規則
- 使用 Prettier 進行程式碼格式化
- 提交信息遵循 Conventional Commits 規範

## 🧪 測試

```bash
# 執行測試（待實現）
npm test

# 執行 E2E 測試（待實現）
npm run test:e2e
```

## 📋 待實現功能

- [ ] 完整的專案 CRUD 操作
- [ ] 詢價單與報價管理
- [ ] 採購流程自動化
- [ ] PDF 報表生成
- [ ] 郵件通知系統
- [ ] 進度追蹤圖表
- [ ] 移動端響應式設計
- [ ] 多語言支援

## 🤝 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 🆘 支援

如遇到問題，請：
1. 查閱此文檔
2. 搜尋現有的 Issues
3. 建立新的 Issue 並提供詳細資訊

## 🔗 相關連結

- [Zeabur 部署平台](https://zeabur.com)
- [Prisma 文檔](https://www.prisma.io/docs)
- [React 文檔](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
# 部署指南

## 🚀 快速部署到 Zeabur

### 方法一：直接從 GitHub 部署（推薦）

1. **上傳程式碼到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "初始提交：建設管理系統"
   git remote add origin https://github.com/your-username/construction-management.git
   git push -u origin main
   ```

2. **登入 Zeabur**
   - 前往 [Zeabur.com](https://zeabur.com)
   - 使用 GitHub 帳戶登入

3. **建立新專案**
   - 點選「New Project」
   - 選擇「Deploy from GitHub」
   - 選擇你的 repository

4. **添加服務**
   
   **步驟 1：新增 PostgreSQL 資料庫**
   - 點選「Add Service」
   - 選擇「PostgreSQL」
   - 等待部署完成

   **步驟 2：新增應用程式**
   - 點選「Add Service」
   - 選擇「Git」
   - 選擇你的 GitHub repository
   - Zeabur 會自動識別為 Node.js 應用程式

5. **設定環境變數**
   在應用程式服務中，點選「Variables」標籤，添加：
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@yourcompany.com
   FROM_NAME=建設管理系統
   ```
   
   **注意**：`DATABASE_URL` 會由 Zeabur 自動設定

6. **部署完成**
   - 等待建構完成
   - Zeabur 會提供一個自動生成的域名
   - 可以綁定自定義域名（支援 HTTPS）

### 方法二：本地測試後部署

1. **本地環境設定**
   ```bash
   # 安裝依賴
   npm install
   cd client && npm install && cd ..
   
   # 設定環境變數
   cp .env.example .env
   # 編輯 .env 文件設定資料庫連接
   
   # 設定資料庫（需要本地 PostgreSQL）
   npm run db:push
   npm run db:seed
   
   # 測試運行
   npm run dev
   # 新開終端
   npm run client:dev
   ```

2. **確認無誤後推送到 GitHub**
   ```bash
   git add .
   git commit -m "測試通過，準備部署"
   git push
   ```

3. **按照方法一的步驟進行 Zeabur 部署**

## 🐳 Docker 部署

### 本地 Docker 測試
```bash
# 建構映像
docker build -t construction-management .

# 執行（需要外部 PostgreSQL）
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  construction-management
```

### Docker Compose（包含資料庫）
```bash
# 啟動完整服務
docker-compose up -d

# 檢查狀態
docker-compose ps

# 查看日誌
docker-compose logs -f app

# 停止服務
docker-compose down
```

## ⚙️ 環境變數說明

| 變數名 | 必需 | 說明 | 範例 |
|--------|------|------|------|
| `DATABASE_URL` | ✅ | PostgreSQL 連接字串 | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | JWT 加密密鑰 | `super-secret-key` |
| `JWT_EXPIRES_IN` | ❌ | Token 過期時間 | `7d` |
| `NODE_ENV` | ❌ | 環境模式 | `production` |
| `PORT` | ❌ | 服務器端口 | `3001` |
| `SMTP_HOST` | ❌ | 郵件服務器 | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | 郵件端口 | `587` |
| `SMTP_USER` | ❌ | 郵件帳號 | `your@gmail.com` |
| `SMTP_PASS` | ❌ | 郵件密碼 | `app-password` |
| `FRONTEND_URL` | ❌ | 前端網址 | `https://yourapp.com` |

## 🔐 預設帳戶

部署完成後，系統會自動建立以下測試帳戶：

| 角色 | 信箱 | 密碼 | 權限 |
|------|------|------|------|
| 管理員 | `admin@construction.com` | `admin123` | 所有權限 |
| 經理 | `manager@construction.com` | `manager123` | 專案管理 |
| 員工 | `staff@construction.com` | `staff123` | 基本操作 |

**⚠️ 生產環境請立即修改預設密碼！**

## 🛠️ 部署後設定

1. **修改預設密碼**
   - 使用管理員帳戶登入
   - 前往個人設定修改密碼

2. **添加實際使用者**
   - 在系統中註冊新用戶
   - 或由管理員手動建立

3. **設定郵件服務**（可選）
   - 申請郵件服務（Gmail、SendGrid 等）
   - 更新環境變數中的 SMTP 設定

4. **綁定自定義域名**（可選）
   - 在 Zeabur 控制台設定域名
   - 支援自動 HTTPS 證書

## 🔍 故障排除

### 常見問題

1. **資料庫連接失敗**
   ```
   Error: P1001: Can't reach database server
   ```
   - 檢查 `DATABASE_URL` 是否正確
   - 確認資料庫服務已啟動

2. **JWT 錯誤**
   ```
   Error: JWT_SECRET_MISSING
   ```
   - 設定 `JWT_SECRET` 環境變數

3. **建構失敗**
   ```
   npm ERR! peer deps missing
   ```
   - 清除 node_modules 重新安裝
   - 檢查 Node.js 版本（需要 18+）

4. **前端無法連接後端**
   - 檢查 CORS 設定
   - 確認 `FRONTEND_URL` 環境變數

### 日誌查看

**Zeabur 部署**：
- 在 Zeabur 控制台查看「Logs」標籤

**Docker 部署**：
```bash
docker-compose logs -f app
```

**本地開發**：
- 查看終端輸出

## 📊 監控與維護

1. **健康檢查端點**
   ```
   GET /health
   ```

2. **資料庫管理**
   ```bash
   # 資料庫遷移
   npm run db:migrate
   
   # 資料庫重置（小心使用）
   npm run db:reset
   
   # 資料庫管理界面
   npm run db:studio
   ```

3. **備份建議**
   - 定期備份 PostgreSQL 資料庫
   - 備份上傳的檔案
   - 記錄重要的環境變數

## 🔄 更新部署

1. **程式碼更新**
   ```bash
   git add .
   git commit -m "更新功能"
   git push
   ```

2. **Zeabur 自動部署**
   - Zeabur 會自動觸發重新部署

3. **資料庫更新**（如有 schema 變更）
   ```bash
   # 先在本地測試遷移
   npm run db:migrate
   
   # 推送遷移文件
   git add prisma/migrations/
   git commit -m "資料庫遷移"
   git push
   ```

## 🎉 部署完成

恭喜！您的建設管理系統已成功部署。系統現在包含：

- ✅ 使用者認證與權限管理
- ✅ 響應式現代化界面
- ✅ 完整的資料庫架構
- ✅ 自動化部署流程
- ✅ 生產環境優化

接下來可以開始開發具體的業務功能模組！
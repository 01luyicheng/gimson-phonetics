# Cloudflare Pages 部署指南

## 📋 部署步骤

### 方法一：GitHub Actions 自动部署（推荐）

#### 1. 配置 Cloudflare 密钥

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加以下 Secrets：

- **CLOUDFLARE_API_TOKEN**: Cloudflare API 令牌
- **CLOUDFLARE_ACCOUNT_ID**: Cloudflare 账户 ID

#### 2. 获取 Cloudflare API 令牌

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **My Profile** → **API Tokens**
3. 点击 **Create Token**
4. 选择 **Edit Cloudflare Workers** 模板
5. 权限配置：
   - **Account.Cloudflare Pages** → **Edit**
   - **Account.Account Settings** → **Read**
6. 点击 **Continue to summary**
7. 点击 **Create Token** 并复制令牌

#### 3. 获取 Cloudflare 账户 ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧边栏找到你的账户 ID
3. 或者访问：https://dash.cloudflare.com/ 查看 URL 中的账户 ID

#### 4. 添加 Secrets 到 GitHub

1. 打开 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下两个密钥：
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: [你的 API 令牌]
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: [你的账户 ID]

#### 5. 推送代码

```bash
git add .
git commit -m "Add Cloudflare Pages deployment configuration"
git push origin main
```

GitHub Actions 将自动触发部署流程。

---

### 方法二：Cloudflare Dashboard 手动部署

#### 1. 连接到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create application** → **Pages**
4. 点击 **Connect to Git**

#### 2. 选择仓库

1. 选择 GitHub 账号
2. 选择仓库：`01luyicheng/gimson-phonetics`
3. 选择分支：`main`
4. 点击 **Begin setup**

#### 3. 配置构建设置

- **Framework preset**: `Vite`
- **Build command**: `npm run build-only`
- **Build output directory**: `dist`
- **Root directory**: `/` (默认)

#### 4. 设置环境变量（可选）

点击 **Environment variables** → **Add variable**：

- Name: `NODE_ENV`
- Value: `production`

#### 5. 部署

点击 **Save and Deploy**

---

### 方法三：使用 Wrangler CLI 本地部署

#### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

#### 3. 构建项目

```bash
npm run build-only
```

#### 4. 部署

```bash
wrangler pages deploy dist --project-name=gimson-phonetics --branch=main
```

---

## 🔧 本地开发预览

### 使用 Wrangler 本地预览

```bash
# 安装依赖
npm install

# 构建
npm run build-only

# 本地预览（使用 Cloudflare Pages 模拟）
wrangler pages dev dist --port 8788
```

---

## 📊 查看部署状态

### GitHub Actions

访问：https://github.com/01luyicheng/gimson-phonetics/actions

### Cloudflare Dashboard

访问：https://dash.cloudflare.com/ → **Workers & Pages** → **gimson-phonetics**

---

## 🌐 访问域名

部署成功后，Cloudflare Pages 将提供以下域名：

- **生产环境**: `https://gimson-phonetics.pages.dev`
- **预览环境**: `https://<commit-hash>.gimson-phonetics.pages.dev`

### 自定义域名（可选）

1. 在 Cloudflare Dashboard 进入项目
2. 点击 **Custom domains**
3. 点击 **Add custom domain**
4. 输入你的域名（如：`gimson.luyicheng.me`）
5. 按照提示配置 DNS

---

## ⚙️ 环境变量配置

### GitHub Secrets

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | Cloudflare Dashboard 右侧边栏 |

### Cloudflare Pages 环境变量

在项目设置中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境标识 |

---

## 🐛 故障排查

### 构建失败

1. 检查 Node.js 版本（需要 20.x）
2. 清除缓存重新构建：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build-only
   ```

### 部署失败

1. 检查 API 令牌权限是否正确
2. 检查账户 ID 是否正确
3. 查看 GitHub Actions 日志获取详细错误信息

### 页面无法访问

1. 检查构建输出目录是否为 `dist`
2. 检查 `vite.config.ts` 中的 `base` 配置
3. 清除浏览器缓存

---

## 📝 注意事项

1. **构建命令**: 使用 `npm run build-only` 而不是 `npm run build`（避免类型检查）
2. **输出目录**: 确保构建输出到 `dist` 目录
3. **缓存策略**: Cloudflare Pages 自动处理缓存优化
4. **重定向规则**: 如需配置 SPA 路由，创建 `_redirects` 文件：
   ```
   /*    /index.html   200
   ```

---

## 🚀 持续集成

每次推送到 `main` 分支时，GitHub Actions 将自动：

1. 安装依赖
2. 构建项目
3. 部署到 Cloudflare Pages

预览部署将在每次 Pull Request 时自动创建。

---

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

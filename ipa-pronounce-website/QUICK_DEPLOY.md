# ⚡ 快速部署到 Cloudflare Pages

## 🎯 完成！部署配置已添加

部署配置文件已推送到 GitHub：`https://github.com/01luyicheng/gimson-phonetics`

---

## 📝 下一步：配置 Cloudflare 密钥

### 1️⃣ 获取 Cloudflare API 令牌

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 权限设置：
   - ✅ **Account.Cloudflare Pages** → **Edit**
   - ✅ **Account.Account Settings** → **Read**
5. 点击 **Create Token**
6. **复制并保存令牌**（只显示一次！）

### 2️⃣ 获取 Cloudflare 账户 ID

1. 访问：https://dash.cloudflare.com/
2. 在右侧边栏找到 **Account ID**
3. **复制账户 ID**

### 3️⃣ 在 GitHub 添加 Secrets

1. 访问：https://github.com/01luyicheng/gimson-phonetics/settings/secrets/actions
2. 点击 **New repository secret**
3. 添加以下两个密钥：

**第一个密钥：**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [粘贴你的 API 令牌]

**第二个密钥：**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: [粘贴你的账户 ID]

---

## 🚀 自动部署

配置完成后，每次推送到 `main` 分支将自动部署：

```bash
# 提交代码更改
git add .
git commit -m "feat: 修复高优先级问题"
git push origin main
```

GitHub Actions 将自动：
1. ✅ 安装依赖
2. ✅ 构建项目
3. ✅ 部署到 Cloudflare Pages

---

## 🌐 访问你的网站

部署成功后，网站将在以下地址可用：

- **生产域名**: `https://gimson-phonetics.pages.dev`
- **自定义域名**: `https://gimson.luyicheng.me` (如果已配置)

---

## 📊 查看部署状态

- **GitHub Actions**: https://github.com/01luyicheng/gimson-phonetics/actions
- **Cloudflare Dashboard**: https://dash.cloudflare.com/ → Workers & Pages → gimson-phonetics

---

## 🔧 手动部署（可选）

如果自动部署失败，可以手动部署：

### 方法 1: Cloudflare Dashboard

1. 访问：https://dash.cloudflare.com/
2. 进入 **Workers & Pages**
3. 点击 **Create application** → **Pages**
4. 连接 GitHub 仓库：`01luyicheng/gimson-phonetics`
5. 构建设置：
   - **Build command**: `npm run build-only`
   - **Build output directory**: `dist`

### 方法 2: Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建并部署
npm run build-only
wrangler pages deploy dist --project-name=gimson-phonetics --branch=main
```

---

## ✅ 检查清单

- [ ] 已获取 Cloudflare API 令牌
- [ ] 已获取 Cloudflare 账户 ID
- [ ] 已在 GitHub 添加 Secrets
- [ ] 已推送到 main 分支
- [ ] 已验证部署成功

---

## 📚 详细文档

完整部署指南请查看：[DEPLOYMENT.md](./DEPLOYMENT.md)

---

**需要帮助？** 

查看 Cloudflare Pages 文档：https://developers.cloudflare.com/pages/

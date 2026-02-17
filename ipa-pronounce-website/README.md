# IPA音标点读网站

一个专业的IPA音标点读网站，帮助英语学习者掌握国际音标发音。

## 项目简介

本项目基于Vue 3 + Vite + Element Plus构建，提供交互式的IPA音标学习体验。包含英语常用音标（44个）的分类展示、点击播放、收藏功能和学习进度跟踪。

## 功能特性

### 核心功能
- ✅ **音标分类浏览**：元音和辅音的分类展示
- ✅ **交互式播放**：点击音标即可播放对应发音
- ✅ **收藏功能**：收藏难学的音标，方便复习
- ✅ **学习进度**：记录已学习的音标
- ✅ **搜索功能**：按音标符号、名称或示例单词搜索
- ✅ **IPA图表**：交互式IPA音标图表
- ✅ **循环播放**：支持连续播放便于模仿
- ✅ **单词示例**：提供包含该音标的常用英语单词

### 音标数据
- **英语元音**：20个（包括单元音和双元音）
- **英语辅音**：24个
- **音频文件**：119个IPA音标发音音频

## 技术栈

- **前端框架**：Vue 3.5
- **构建工具**：Vite 7.3
- **UI组件库**：Element Plus
- **状态管理**：Pinia 3.0
- **路由**：Vue Router 5.0
- **音频处理**：Web Audio API + HTML5 Audio

## 项目结构

```
ipa-pronounce-website/
├── public/
│   └── ipa-audio/          # 119个IPA音标音频文件
├── src/
│   ├── assets/             # 静态资源
│   ├── components/         # 可复用组件
│   │   ├── PhonemeCard.vue  # 音标卡片组件
│   │   ├── AudioPlayer.vue  # 音频播放器组件
│   │   └── IPAChart.vue     # IPA图表组件
│   ├── views/              # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── Vowels.vue       # 元音页面
│   │   ├── Consonants.vue   # 辅音页面
│   │   ├── Favorites.vue    # 收藏页面
│   │   └── Chart.vue        # 图表页面
│   ├── stores/             # 状态管理
│   │   └── phonemes.js      # 音标数据管理
│   ├── data/               # 数据文件
│   │   └── ipa-data.js      # IPA音标数据配置
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── App.vue             # 主应用组件
│   └── main.ts             # 应用入口
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录

### 预览生产版本

```bash
npm run preview
```

## 部署指南

### Vercel 部署（推荐）

1. 将项目推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. Vercel 会自动检测并使用 Vite 配置
4. 部署完成后，访问提供的 URL

### Netlify 部署

1. 将项目推送到 GitHub 仓库
2. 在 Netlify 中导入项目
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`
5. 部署完成后，访问提供的 URL

### GitHub Pages 部署

1. 安装 GitHub Actions
2. 创建 `.github/workflows/deploy.yml` 文件
3. 配置自动部署到 GitHub Pages

## 数据结构

### 音标数据模型

```javascript
{
  symbol: 'iː',                    // IPA符号
  name: '长元音 iː',               // 音标名称
  type: 'vowel',                  // 类型：vowel/consonant
  category: 'close',              // 分类
  position: 'front',              // 位置
  rounded: false,                 // 是否圆唇
  audioFile: 'Close_front_unrounded_vowel.mp3', // 音频文件名
  examples: ['see', 'tree', 'me'], // 单词示例
  description: '发音时舌前部抬高，嘴唇不圆', // 发音描述
  difficulty: 1,                  // 难度等级 1-5
  isEnglish: true,                // 是否为英语音标
  englishName: 'Close front unrounded vowel' // 英文名称
}
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发说明

### 代码规范

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码规范检查
- 使用 OxLint 进行性能优化检查

### 组件开发

所有组件都遵循 Vue 3 Composition API 规范：
- 使用 `<script setup>` 语法
- 使用 `defineProps` 和 `defineEmits` 定义组件接口
- 使用 `computed` 和 `ref` 进行响应式状态管理

### 样式规范

- 使用 CSS 变量进行主题配置
- 支持响应式设计
- 支持暗色模式（可扩展）
- 支持无障碍访问

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过 GitHub Issues 反馈。

---

**IPA音标点读网站** © 2024

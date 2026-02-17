<script setup lang="ts">
/**
 * 应用根组件
 * 文件用途：全局布局、主题切换、导航栏、路由视图容器
 * 创建日期：2026-02-17
 * 输入：无
 * 输出：应用整体布局框架
 * 依赖：Vue 3, Vue Router, Pinia
 */

import { RouterView, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePhonemeStore } from '@/stores/phonemes'

console.log('%c📄 App.vue 脚本开始执行', 'color: #8b5cf6; font-weight: bold;')

const route = useRoute()
const store = usePhonemeStore()
const isDark = ref(false)

const currentRoute = computed(() => route.name)
const favoriteCount = computed(() => store.favorites.length)

console.log('%c📊 App.vue 响应式变量初始化完成', 'color: #10b981;')

watch(currentRoute, (newRoute, oldRoute) => {
  console.log('%c━━━━━━━━━━━━━━━━ 路由变化 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log(`%c🔄 从 ${String(oldRoute || 'null')} 切换到 ${String(newRoute)}`, 'color: #8b5cf6;')
  console.log(`%c📍 当前路径: ${route.path}`, 'color: #64748b;')
  console.log(`%c📋 路由参数: ${JSON.stringify(route.params)}`, 'color: #64748b;')
  console.log(`%c🔍 查询参数: ${JSON.stringify(route.query)}`, 'color: #64748b;')
}, { immediate: false })

const toggleTheme = () => {
  const oldTheme = isDark.value ? 'dark' : 'light'
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  
  console.log('%c━━━━━━━━━━━━━━━━ 主题切换 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  console.log(`%c🎨 主题切换: ${oldTheme} → ${newTheme}`, 'color: #f59e0b;')
  
  applyTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  
  console.log(`%c💾 主题已保存到 localStorage`, 'color: #10b981;')
  console.log(`%c🌐 data-theme 属性: ${isDark.value ? 'dark' : 'light'}`, 'color: #64748b;')
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  console.log(`%c✅ 主题已应用到 DOM`, 'color: #10b981;')
}

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  console.log('%c━━━━━━━━━━━━━━━━ 系统主题变化 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  console.log(`%c🖥️ 系统主题变化: ${e.matches ? 'dark' : 'light'}`, 'color: #f59e0b;')
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches
    applyTheme()
    console.log(`%c✅ 已跟随系统主题`, 'color: #10b981;')
  } else {
    console.log(`%cℹ️ 用户已设置主题，忽略系统主题变化`, 'color: #64748b;')
  }
}

onMounted(() => {
  console.log('%c━━━━━━━━━━━━━━━━ App.vue 挂载 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
  console.log('%c📱 App.vue 组件开始挂载...', 'color: #10b981;')
  
  const savedTheme = localStorage.getItem('theme')
  console.log(`%c💾 localStorage 中的主题设置: ${savedTheme || '未设置'}`, 'color: #64748b;')
  
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    console.log(`%c📋 使用保存的主题: ${savedTheme}`, 'color: #10b981;')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    console.log(`%c🖥️ 使用系统主题: ${prefersDark ? 'dark' : 'light'}`, 'color: #10b981;')
  }
  
  applyTheme()
  
  console.log('%c⏳ 正在初始化 Store...', 'color: #f59e0b;')
  store.initializeStore()
  
  console.log('%c━━━━━━━━━━━━━━━━ Store 状态 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log(`%c⭐ 收藏夹数量: ${favoriteCount.value}`, 'color: #10b981;')
  console.log(`%c📈 学习进度: ${store.progress.length} / ${store.phonemes.length}`, 'color: #10b981;')
  console.log(`%c🎵 播放全部模式: ${store.playAllMode ? '开启' : '关闭'}`, 'color: #10b981;')
  console.log(`%c📱 微信浏览器: ${store.isWechatBrowser ? '是' : '否'}`, 'color: #10b981;')
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  console.log('%c✅ 系统主题变化监听器已注册', 'color: #10b981;')
  
  console.log('%c✅ App.vue 组件挂载完成', 'color: #10b981; font-weight: bold;')
})

onUnmounted(() => {
  console.log('%c👋 App.vue 组件卸载', 'color: #f59e0b;')
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
  console.log('%c✅ 系统主题变化监听器已移除', 'color: #10b981;')
})

watch(favoriteCount, (newCount, oldCount) => {
  console.log('%c━━━━━━━━━━━━━━━━ 收藏夹变化 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  console.log(`%c⭐ 收藏数量变化: ${oldCount} → ${newCount}`, 'color: #f59e0b;')
  if (newCount > oldCount) {
    console.log(`%c❤️ 新增了 ${newCount - oldCount} 个收藏`, 'color: #ef4444;')
  } else if (newCount < oldCount) {
    console.log(`%c💔 移除了 ${oldCount - newCount} 个收藏`, 'color: #64748b;')
  }
}, { immediate: false })

watch(isDark, (newVal, oldVal) => {
  console.log(`%c🌙 isDark 响应式变化: ${oldVal} → ${newVal}`, 'color: #8b5cf6;')
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-inner">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-emoji">🎤</span>
          <span class="logo-text">英语音标点读</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-item" :class="{ active: currentRoute === 'home' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span class="nav-label">首页</span>
          </router-link>

          <router-link to="/favorites" class="nav-item" :class="{ active: currentRoute === 'favorites' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span class="nav-label">收藏夹</span>
            <span v-if="favoriteCount > 0" class="nav-badge">{{ favoriteCount }}</span>
          </router-link>
        </nav>

        <!-- 主题切换 -->
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
          <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- 底部 -->
    <footer class="app-footer">
      <p class="footer-text">英语国际音标点读网站 · English IPA Pronunciation</p>
    </footer>
  </div>
</template>

<style>
/* ============================================
   文件用途: 应用根组件 - 全局布局和主题
   创建日期: 2026-02-17
   输入: 无
   输出: 应用整体布局框架
   依赖: Vue 3, Vue Router
   ============================================ */

/* CSS Reset & Base Styles */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* CSS Variables - 浅色主题 */
:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --border-color: #e2e8f0;
  --border-light: #f1f5f9;
  --accent-primary: #3b82f6;
  --accent-success: #10b981;
  --accent-warning: #f59e0b;
  --accent-danger: #ef4444;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

/* CSS Variables - 深色主题 */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #252f47;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-color: #334155;
  --border-light: #1e293b;
  --accent-primary: #60a5fa;
  --accent-success: #34d399;
  --accent-warning: #fbbf24;
  --accent-danger: #f87171;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
}

/* Body Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* App Container */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* ============================================
   顶部导航栏
   ============================================ */
.app-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo-emoji {
  font-size: 24px;
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-item.active {
  color: var(--accent-primary);
  background: rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .nav-item.active {
  background: rgba(96, 165, 250, 0.15);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.nav-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: var(--accent-warning);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 18px;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--border-color);
  transform: scale(1.05);
}

.theme-icon {
  line-height: 1;
}

/* ============================================
   主内容区
   ============================================ */
.app-main {
  flex: 1;
  background: var(--bg-primary);
}

/* ============================================
   底部
   ============================================ */
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 20px 24px;
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* ============================================
   响应式设计
   ============================================ */
@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
    height: 56px;
  }

  .logo-text {
    font-size: 16px;
  }

  .nav-menu {
    gap: 4px;
  }

  .nav-item {
    padding: 8px 12px;
  }

  .nav-label {
    display: none;
  }

  .theme-toggle {
    width: 36px;
    height: 36px;
  }

  .app-footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .header-inner {
    padding: 0 12px;
  }

  .logo-emoji {
    font-size: 20px;
  }

  .logo-text {
    font-size: 15px;
  }

  .nav-item {
    padding: 8px;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
  }
}

/* ============================================
   工具类
   ============================================ */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 选中文字样式 */
::selection {
  background: var(--accent-primary);
  color: white;
}
</style>

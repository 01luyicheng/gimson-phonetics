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

const route = useRoute()
const store = usePhonemeStore()
const isDark = ref(false)

const currentRoute = computed(() => route.name)
const favoriteCount = computed(() => store.favorites.length)

watch(currentRoute, (newRoute, oldRoute) => {
  console.log(`路由切换: ${String(oldRoute || 'null')} -> ${String(newRoute)}`)
}, { immediate: false })

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches
    applyTheme()
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
  }
  applyTheme()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-inner">
        <!-- Logo -->
        <router-link to="/" class="logo">
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
      <p class="footer-text">Gimson音标点读网站</p>
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
  box-shadow: var(--shadow-sm);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.02);
}

.logo-emoji {
  font-size: 24px;
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item:hover {
  color: var(--accent-primary);
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
    padding: 6px 12px;
    font-size: 13px;
  }

  .nav-label {
    display: none;
  }

  .app-footer {
    padding: 16px;
  }
}
</style>

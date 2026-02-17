<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { usePhonemeStore } from '@/stores/phonemes'

const route = useRoute()
const store = usePhonemeStore()
const isDark = ref(false)

const currentRoute = computed(() => route.name)
const favoriteCount = computed(() => store.favorites.length)

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
  store.initializeStore()
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo-section">
          <span class="logo-icon">🎤</span>
          <h1>英语音标点读</h1>
        </router-link>
        
        <nav class="nav-menu">
          <router-link to="/" class="nav-link" :class="{ active: currentRoute === 'home' }">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>首页</span>
          </router-link>
          <router-link to="/favorites" class="nav-link" :class="{ active: currentRoute === 'favorites' }">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span>收藏夹</span>
            <span v-if="favoriteCount > 0" class="badge">{{ favoriteCount }}</span>
          </router-link>
        </nav>
        
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>英语国际音标点读网站 · English IPA Pronunciation</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-color: #f8fafc;
  --bg-color-secondary: #ffffff;
  --text-color: #1e293b;
  --text-color-secondary: #64748b;
  --border-color: #e2e8f0;
  --primary-color: #3b82f6;
}

[data-theme="dark"] {
  --bg-color: #0f172a;
  --bg-color-secondary: #1e293b;
  --text-color: #f1f5f9;
  --text-color-secondary: #94a3b8;
  --border-color: #334155;
  --primary-color: #60a5fa;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--bg-color-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  font-size: 24px;
}

.logo-section h1 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.nav-link:hover {
  color: var(--text-color);
  background: var(--bg-color);
}

.nav-link.active {
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.1);
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: #f59e0b;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.app-main {
  flex: 1;
  background: var(--bg-color);
}

.app-footer {
  background: var(--bg-color-secondary);
  color: var(--text-color-secondary);
  padding: 16px 20px;
  text-align: center;
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.app-footer p {
  font-size: 13px;
}

@media (max-width: 640px) {
  .header-content {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .logo-section h1 {
    font-size: 16px;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  
  .nav-link {
    flex: 1;
    justify-content: center;
    padding: 10px;
  }
  
  .theme-toggle {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>

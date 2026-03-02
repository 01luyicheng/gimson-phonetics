<template>
  <div class="home-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-title">
        <h1 class="main-title">英语音标点读</h1>
        <p class="subtitle">English Phonetic Symbols</p>
      </div>
    </header>

    <!-- 信息提示卡片 -->
    <div class="info-card" v-if="!searchQuery" :class="{ collapsed: isInfoCardCollapsed }">
      <div class="info-header" @click="toggleInfoCard">
        <div class="info-header-left">
          <div class="info-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <span class="info-header-title">本页面展示的是英语（英式）中使用的44个音标</span>
        </div>
        <button class="collapse-btn" :aria-label="isInfoCardCollapsed ? '展开' : '折叠'">
          <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: isInfoCardCollapsed }">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
      </div>
      <div class="info-content" v-show="!isInfoCardCollapsed">
        <p class="info-main">本页面展示的是<strong>英语（英式）中使用的44个音标</strong>，采用Gimson音标系统。</p>
        <p class="info-sub">
          <strong>科普：</strong><a href="https://ipachart.app/zh-CN" target="_blank" rel="noopener" class="ipa-link">国际音标（IPA，International Phonetic Alphabet）</a>是一套记录人类所有语言语音的符号系统，共有<b>107个字母</b>和<b>56个变音符号</b>。
          而Gimson音标是IPA的一个子集，专门用于标注英语发音，是国内英语教材通用的音标体系。
        </p>
        <div class="phonetic-comparison">
          <p class="comparison-title">📖 同一个单词的不同标注方式对比：</p>
          <div class="comparison-items">
            <div class="comparison-item">
              <span class="word">单词 "see"</span>
              <span class="phonetic gimson">Gimson: /siː/</span>
              <span class="phonetic ipa">IPA: [siː]</span>
            </div>
            <div class="comparison-item">
              <span class="word">单词 "cat"</span>
              <span class="phonetic gimson">Gimson: /kæt/</span>
              <span class="phonetic ipa">IPA: [kʰætʰ]</span>
            </div>
            <div class="comparison-item">
              <span class="word">单词 "stop"</span>
              <span class="phonetic gimson">Gimson: /stɒp/</span>
              <span class="phonetic ipa">IPA: [st̺ɒp]</span>
            </div>
          </div>
          <p class="comparison-note">💡 提示：IPA标注更精确，包含送气符号（ʰ）等细节；Gimson音标更简洁，适合英语学习者使用。</p>
        </div>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索音标、单词..."
          class="search-input"
          enterkeyhint="search"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch" aria-label="清除搜索">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <button
        class="play-all-btn"
        :class="{ playing: playAllMode }"
        @click="handlePlayAll"
        :aria-label="playAllMode ? '停止播放' : '播放全部'"
      >
        <span class="btn-icon">
          <svg v-if="!playAllMode" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </span>
        <span class="btn-text">{{ playAllMode ? '停止' : '播放全部' }}</span>
      </button>
    </div>

    <!-- 搜索结果提示 -->
    <div class="search-status" v-if="searchQuery">
      <div class="status-content">
        <span class="status-text">找到 <strong>{{ filteredPhonemes.length }}</strong> 个结果</span>
        <button class="clear-search-btn" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          清除搜索
        </button>
      </div>
    </div>

    <!-- 无搜索结果 -->
    <div class="empty-state" v-if="searchQuery && filteredPhonemes.length === 0">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
      <h3 class="empty-title">未找到匹配的音标</h3>
      <p class="empty-hint">试试其他关键词，如：/iː/、/ə/、cat、see</p>
    </div>

    <!-- 搜索结果列表 -->
    <template v-if="searchQuery && filteredPhonemes.length > 0">
      <section class="phonemes-section">
        <div class="phoneme-grid">
          <PhonemeCard
            v-for="phoneme in filteredPhonemes"
            :key="phoneme.symbol"
            :phoneme="phoneme"
          />
        </div>
      </section>
    </template>

    <!-- 正常分类展示 -->
    <template v-else-if="!searchQuery">
      <!-- 元音部分 -->
      <section class="phonemes-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h2 class="section-title">元音</h2>
            <span class="section-count">{{ vowelCount }}个</span>
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            单元音 · Monophthongs
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in monophthongs"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            双元音 · Diphthongs
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in diphthongs"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
      </section>

      <!-- 辅音部分 -->
      <section class="phonemes-section">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h2 class="section-title">辅音</h2>
            <span class="section-count">{{ consonantCount }}个</span>
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            爆破音 · Plosives
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in plosives"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            摩擦音 · Fricatives
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in fricatives"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            破擦音 · Affricates
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in affricates"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            鼻音 · Nasals
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in nasals"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>

        <div class="subsection">
          <h3 class="subsection-title">
            <span class="subsection-dot"></span>
            近音 · Approximants
          </h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in approximants"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
      </section>
    </template>

    <!-- 页面底部 -->
    <footer class="page-footer">
      <div class="footer-content">
        <p>©陆奕丞</p>
        <span class="footer-divider">·</span>
        <p>音频来源：<a href="https://ipachart.app" target="_blank" rel="noopener">ipachart.app</a></p>
        <span class="footer-divider">·</span>
        <p>点击卡片播放音标发音</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
/**
 * 首页视图组件
 * 文件用途：展示所有音标卡片、搜索功能、播放全部功能
 * 创建日期：2026-02-17
 * 输入：无
 * 输出：音标列表页面
 * 依赖：Vue 3, Pinia store, PhonemeCard组件
 */

import { computed, onMounted, watch, onUnmounted, ref } from 'vue';
import { usePhonemeStore } from '@/stores/phonemes';
import PhonemeCard from '@/components/PhonemeCard.vue';
import {
  vowelCount,
  consonantCount,
  monophthongs,
  diphthongs,
  plosives,
  fricatives,
  affricates,
  nasals,
  approximants
} from '@/data/ipa-data';

if (import.meta.env.DEV) {
  console.log('%c━━━━━━━━━━━━━━━━ Home.vue ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log('%c📄 Home.vue 脚本开始执行', 'color: #8b5cf6; font-weight: bold;')
}

const store = usePhonemeStore();
const searchInputRef = ref(null);
const lastSearchTime = ref(0);

const INFO_CARD_COLLAPSED_KEY = 'ipa-info-card-collapsed';

const getInitialCollapsedState = () => {
  const saved = localStorage.getItem(INFO_CARD_COLLAPSED_KEY);
  return saved === 'true';
};

const isInfoCardCollapsed = ref(getInitialCollapsedState());

const toggleInfoCard = () => {
  isInfoCardCollapsed.value = !isInfoCardCollapsed.value;
  localStorage.setItem(INFO_CARD_COLLAPSED_KEY, String(isInfoCardCollapsed.value));
};

if (import.meta.env.DEV) {
  console.log('%c📊 Home.vue 响应式变量初始化完成', 'color: #10b981;')
}

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value) => {
    const now = Date.now()
    const timeSinceLastSearch = now - lastSearchTime.value
    lastSearchTime.value = now
    
    if (import.meta.env.DEV) {
      console.log('%c━━━━━━━━━━━━━━━━ 搜索输入 ━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;')
      console.log(`%c🔍 搜索内容: "${value}"`, 'color: #3b82f6;')
      console.log(`%c📏 输入长度: ${value.length} 字符`, 'color: #64748b;')
      console.log(`%c⏱️ 距上次输入: ${timeSinceLastSearch}ms`, 'color: #64748b;')
    }
    
    store.searchQuery = value;
  }
});

const filteredPhonemes = computed(() => store.filteredPhonemes);
const playAllMode = computed(() => store.playAllMode);

watch(filteredPhonemes, (newVal, oldVal) => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 筛选结果 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
    console.log(`%c📋 筛选结果更新: ${oldVal?.length || 0} → ${newVal.length} 个`, 'color: #10b981;')
    if (newVal.length > 0 && newVal.length <= 10) {
      console.log('%c📝 筛选到的音标:', 'color: #64748b;')
      newVal.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.symbol} - ${p.chineseName}`)
      })
    }
  }
}, { immediate: false })

watch(playAllMode, (newVal, oldVal) => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 播放全部模式 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
    console.log(`%c🎵 播放全部模式: ${oldVal ? '开启' : '关闭'} → ${newVal ? '开启' : '关闭'}`, 'color: #f59e0b;')
    if (newVal) {
      console.log(`%c📊 当前播放位置: 第 ${store.playAllIndex + 1} 个音标`, 'color: #64748b;')
      console.log(`%c📊 保存的播放位置: 第 ${store.savedPlayAllIndex + 1} 个音标`, 'color: #64748b;')
    }
  }
}, { immediate: false })

watch(searchQuery, (newVal, oldVal) => {
  if (import.meta.env.DEV && newVal !== oldVal) {
    console.log(`%c🔎 searchQuery 变化: "${oldVal}" → "${newVal}"`, 'color: #8b5cf6;')
  }
})

const clearSearch = () => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 清除搜索 ━━━━━━━━━━━━━━━━', 'color: #64748b; font-weight: bold;')
    console.log(`%c🧹 清除搜索内容: "${store.searchQuery}"`, 'color: #64748b;')
    console.log(`%c📊 清除前筛选结果: ${filteredPhonemes.value.length} 个`, 'color: #64748b;')
  }
  store.searchQuery = '';
  if (import.meta.env.DEV) {
    console.log('%c✅ 搜索已清除', 'color: #10b981;')
  }
};

const handlePlayAll = () => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 播放全部按钮 ━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;')
    console.log('%c▶️ 用户点击播放全部按钮', 'color: #3b82f6; font-weight: bold;')
    console.log(`%c📊 当前播放状态: playAllMode=${store.playAllMode}`, 'color: #64748b;')
    console.log(`%c📊 当前播放位置: playAllIndex=${store.playAllIndex}`, 'color: #64748b;')
    console.log(`%c📊 保存的播放位置: savedPlayAllIndex=${store.savedPlayAllIndex}`, 'color: #64748b;')
    
    if (store.playAllMode) {
      console.log('%c⏹️ 将停止播放', 'color: #ef4444;')
    } else {
      console.log('%c▶️ 将开始播放', 'color: #10b981;')
      if (store.savedPlayAllIndex > 0) {
        console.log(`%c📍 将从第 ${store.savedPlayAllIndex + 1} 个音标继续播放`, 'color: #f59e0b;')
      }
    }
  }
  
  store.playAllPhonemes();
};

const handleSearchFocus = () => {
  if (import.meta.env.DEV) {
    console.log('%c🎯 搜索框获得焦点', 'color: #3b82f6;')
  }
}

const handleSearchBlur = () => {
  if (import.meta.env.DEV) {
    console.log('%c🎯 搜索框失去焦点', 'color: #64748b;')
  }
}

const handleSearchKeydown = (e) => {
  if (import.meta.env.DEV) {
    console.log(`%c⌨️ 搜索框按键: ${e.key}`, 'color: #64748b;')
  }
  if (e.key === 'Escape') {
    clearSearch()
  }
}

onMounted(() => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ Home.vue 挂载 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
    console.log('%c🏠 Home.vue 组件开始挂载...', 'color: #10b981;')
  }
  
  const mountStartTime = performance.now()
  
  if (import.meta.env.DEV) {
    console.log('%c⏳ 加载音标数据...', 'color: #f59e0b;')
    console.log(`%c📊 音标数据统计:`, 'color: #3b82f6;')
    console.log(`%c   📊 元音总数: ${vowelCount}`, 'color: #10b981;')
    console.log(`%c   📊 辅音总数: ${consonantCount}`, 'color: #10b981;')
    console.log(`%c   📊 单元音: ${monophthongs.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 双元音: ${diphthongs.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 爆破音: ${plosives.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 摩擦音: ${fricatives.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 破擦音: ${affricates.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 鼻音: ${nasals.length} 个`, 'color: #10b981;')
    console.log(`%c   📊 近音: ${approximants.length} 个`, 'color: #10b981;')
  }
  
  store.initializeStore();
  
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ Store 状态 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
    console.log(`%c⭐ 收藏数量: ${store.favorites.length}`, 'color: #10b981;')
    console.log(`%c📈 学习进度: ${store.progress.length} / ${store.phonemes.length}`, 'color: #10b981;')
    console.log(`%c🔍 搜索内容: "${store.searchQuery || '空'}"`, 'color: #10b981;')
    
    const mountEndTime = performance.now()
    console.log(`%c⏱️ Home.vue 挂载耗时: ${(mountEndTime - mountStartTime).toFixed(2)}ms`, 'color: #10b981;')
    console.log('%c✅ Home.vue 组件挂载完成', 'color: #10b981; font-weight: bold;')
  }
})

onUnmounted(() => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ Home.vue 卸载 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
    console.log('%c👋 Home.vue 组件开始卸载...', 'color: #f59e0b;')
    console.log(`%c📊 当前搜索内容: "${store.searchQuery || '空'}"`, 'color: #64748b;')
    console.log(`%c📊 播放全部模式: ${store.playAllMode ? '开启' : '关闭'}`, 'color: #64748b;')
    console.log('%c✅ Home.vue 组件卸载完成', 'color: #f59e0b;')
  }
})
</script>

<style scoped>
/* ============================================
   文件用途: 首页视图 - 展示所有音标卡片
   创建日期: 2026-02-17
   输入: 无
   输出: 音标列表页面
   依赖: Vue 3, Pinia store, PhonemeCard组件
   ============================================ */

.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
}

/* ============================================
   页面头部
   ============================================ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  gap: 24px;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color, #1e293b);
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary, #64748b);
  margin: 0;
  font-weight: 400;
}

/* 操作栏 */
.action-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

/* 搜索框 */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted, #94a3b8);
  pointer-events: none;
}

.search-input {
  padding: 12px 40px 12px 42px;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-secondary, #ffffff);
  color: var(--text-color, #1e293b);
  transition: all 0.2s ease;
  
  /* 移动端优化 */
  -webkit-appearance: none;
  appearance: none;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted, #94a3b8);
}

/* 移动端搜索框优化 */
@supports (-webkit-touch-callout: none) {
  .search-input {
    font-size: 16px; /* 防止iOS缩放 */
  }
}

.clear-btn {
  position: absolute;
  right: 10px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-color, #e2e8f0);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.clear-btn svg {
  width: 12px;
  height: 12px;
  color: var(--text-secondary, #64748b);
}

.clear-btn:hover {
  background: #cbd5e1;
}

.clear-btn:active {
  transform: scale(0.9);
}

/* 播放全部按钮 */
.play-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  /* 移动端优化触摸目标 */
  min-height: 44px;
}

.play-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.play-all-btn:active {
  transform: translateY(0) scale(0.98);
}

.play-all-btn.playing {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.play-all-btn.playing:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-icon svg {
  width: 18px;
  height: 18px;
  display: block;
}

/* ============================================
   信息提示卡片
   ============================================ */
.info-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  overflow: hidden;
  transition: all 0.2s ease;
}

.info-card.collapsed {
  margin-bottom: 16px;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
}

.info-header:hover {
  background: rgba(245, 158, 11, 0.1);
}

.info-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon-wrapper {
  width: 28px;
  height: 28px;
  background: rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon-wrapper svg {
  width: 16px;
  height: 16px;
  color: #d97706;
}

.info-header-title {
  font-size: 13px;
  font-weight: 500;
  color: #78350f;
}

.collapse-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(245, 158, 11, 0.2);
}

.collapse-btn svg {
  width: 18px;
  height: 18px;
  color: #d97706;
  transition: transform 0.2s ease;
}

.collapse-btn svg.rotated {
  transform: rotate(-90deg);
}

.info-content {
  padding: 0 14px 12px 14px;
  border-top: 1px solid rgba(245, 158, 11, 0.15);
  margin-top: 0;
  padding-top: 10px;
}

.info-main {
  font-size: 13px;
  color: #78350f;
  margin: 0 0 4px 0;
  line-height: 1.4;
  font-weight: 500;
}

.info-main strong {
  color: #92400e;
  font-weight: 600;
}

.info-sub {
  font-size: 12px;
  color: #a16207;
  margin: 0 0 8px 0;
  opacity: 0.9;
  line-height: 1.5;
}

/* 音标对比区域 */
.phonetic-comparison {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 6px;
}

.comparison-title {
  font-size: 12px;
  font-weight: 600;
  color: #78350f;
  margin: 0 0 6px 0;
}

.comparison-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
}

.comparison-item .word {
  font-size: 12px;
  font-weight: 600;
  color: #78350f;
  min-width: 70px;
}

.comparison-item .phonetic {
  font-size: 12px;
  font-family: 'Times New Roman', serif;
  padding: 1px 6px;
  border-radius: 3px;
}

.comparison-item .phonetic.gimson {
  background: #dcfce7;
  color: #166534;
}

.comparison-item .phonetic.ipa {
  background: #dbeafe;
  color: #1e40af;
}

.comparison-note {
  font-size: 11px;
  color: #92400e;
  margin: 6px 0 0 0;
  font-style: italic;
  opacity: 0.85;
}

/* IPA链接样式 */
.ipa-link {
  color: #92400e;
  text-decoration: underline;
  text-decoration-style: dotted;
  font-weight: 600;
  transition: all 0.2s ease;
}

.ipa-link:hover {
  color: #78350f;
  text-decoration-style: solid;
}

[data-theme="dark"] .ipa-link {
  color: #fbbf24;
}

[data-theme="dark"] .ipa-link:hover {
  color: #f59e0b;
}

/* ============================================
   搜索状态
   ============================================ */
.search-status {
  margin-bottom: 24px;
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #eff6ff;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.status-text {
  font-size: 14px;
  color: var(--text-color, #1e293b);
}

.status-text strong {
  color: #3b82f6;
  font-weight: 700;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* 移动端优化 */
  min-height: 36px;
}

.clear-search-btn svg {
  width: 14px;
  height: 14px;
}

.clear-search-btn:hover {
  background: #3b82f6;
  color: white;
}

.clear-search-btn:active {
  transform: scale(0.95);
}

/* ============================================
   空状态
   ============================================ */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-secondary, #ffffff);
  border-radius: 20px;
  border: 2px dashed var(--border-color, #e2e8f0);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #f1f5f9;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: #94a3b8;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color, #1e293b);
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-secondary, #64748b);
  margin: 0;
}

/* ============================================
   音标区块
   ============================================ */
.phonemes-section {
  margin-bottom: 48px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12px;
}

.section-icon.vowel-icon {
  background: #dcfce7;
}

.section-icon.consonant-icon {
  background: #dbeafe;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color, #1e293b);
  margin: 0;
}

.section-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
  margin-left: 4px;
}

/* 子区块 */
.subsection {
  margin-bottom: 32px;
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary, #64748b);
  margin: 0 0 16px 0;
}

.subsection-dot {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 50%;
}

/* ============================================
   音标网格
   ============================================ */
.phoneme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

/* ============================================
   页面底部
   ============================================ */
.page-footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color, #e2e8f0);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-content p {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted, #94a3b8);
}

.footer-content a {
  color: var(--text-secondary, #64748b);
  text-decoration: none;
  font-weight: 500;
}

.footer-content a:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.footer-divider {
  color: var(--border-color, #e2e8f0);
}

/* ============================================
   深色模式适配
   ============================================ */
[data-theme="dark"] .page-header {
  border-bottom-color: #334155;
}

[data-theme="dark"] .main-title {
  color: #f1f5f9;
}

[data-theme="dark"] .search-input {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

[data-theme="dark"] .search-input:focus {
  background: #252f47;
}

[data-theme="dark"] .clear-btn {
  background: #334155;
}

[data-theme="dark"] .clear-btn svg {
  color: #94a3b8;
}

[data-theme="dark"] .clear-btn:hover {
  background: #475569;
}

[data-theme="dark"] .info-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
  border-color: rgba(245, 158, 11, 0.2);
}

[data-theme="dark"] .info-header:hover {
  background: rgba(245, 158, 11, 0.15);
}

[data-theme="dark"] .info-icon-wrapper {
  background: rgba(245, 158, 11, 0.2);
}

[data-theme="dark"] .info-icon-wrapper svg {
  color: #fbbf24;
}

[data-theme="dark"] .info-header-title {
  color: #fcd34d;
}

[data-theme="dark"] .collapse-btn svg {
  color: #fbbf24;
}

[data-theme="dark"] .collapse-btn:hover {
  background: rgba(245, 158, 11, 0.2);
}

[data-theme="dark"] .info-content {
  border-top-color: rgba(245, 158, 11, 0.15);
}

[data-theme="dark"] .info-main {
  color: #fcd34d;
}

[data-theme="dark"] .info-main strong {
  color: #fbbf24;
}

[data-theme="dark"] .info-sub {
  color: #fde68a;
}

[data-theme="dark"] .phonetic-comparison {
  background: rgba(30, 41, 59, 0.5);
}

[data-theme="dark"] .comparison-title {
  color: #fcd34d;
}

[data-theme="dark"] .comparison-item {
  background: rgba(30, 41, 59, 0.6);
}

[data-theme="dark"] .comparison-item .word {
  color: #fcd34d;
}

[data-theme="dark"] .comparison-item .phonetic.gimson {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

[data-theme="dark"] .comparison-item .phonetic.ipa {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

[data-theme="dark"] .comparison-note {
  color: #fde68a;
}

[data-theme="dark"] .status-content {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

[data-theme="dark"] .clear-search-btn {
  border-color: #60a5fa;
  color: #60a5fa;
}

[data-theme="dark"] .clear-search-btn:hover {
  background: #3b82f6;
  color: white;
}

[data-theme="dark"] .empty-state {
  background: #1e293b;
  border-color: #334155;
}

[data-theme="dark"] .empty-icon {
  background: #334155;
}

[data-theme="dark"] .empty-icon svg {
  color: #64748b;
}

[data-theme="dark"] .empty-title {
  color: #e2e8f0;
}

[data-theme="dark"] .section-title {
  color: #f1f5f9;
}

[data-theme="dark"] .section-icon {
  background: #334155;
}

[data-theme="dark"] .section-icon.vowel-icon {
  background: rgba(34, 197, 94, 0.2);
}

[data-theme="dark"] .section-icon.consonant-icon {
  background: rgba(59, 130, 246, 0.2);
}

[data-theme="dark"] .section-count {
  background: #334155;
  color: #94a3b8;
}

[data-theme="dark"] .subsection-title {
  color: #94a3b8;
}

[data-theme="dark"] .subsection-dot {
  background: #475569;
}

[data-theme="dark"] .page-footer {
  border-top-color: #334155;
}

[data-theme="dark"] .footer-content p {
  color: #64748b;
}

[data-theme="dark"] .footer-content a {
  color: #94a3b8;
}

[data-theme="dark"] .footer-divider {
  color: #334155;
}

/* ============================================
   响应式设计 - 移动端优化
   ============================================ */
@media (max-width: 768px) {
  .home-page {
    padding: 20px 16px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .action-bar {
    flex-direction: column;
    width: 100%;
    gap: 10px;
    margin-bottom: 20px;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    width: 100%;
    max-width: none;
    padding: 14px 44px 14px 46px;
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .search-icon {
    left: 16px;
    width: 20px;
    height: 20px;
  }
  
  .clear-btn {
    right: 12px;
    width: 24px;
    height: 24px;
  }

  .play-all-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    min-height: 48px;
  }

  .main-title {
    font-size: 26px;
  }

  .info-card {
    margin-bottom: 16px;
  }

  .info-header {
    padding: 8px 12px;
  }

  .info-icon-wrapper {
    width: 24px;
    height: 24px;
  }

  .info-icon-wrapper svg {
    width: 14px;
    height: 14px;
  }

  .info-header-title {
    font-size: 12px;
  }

  .info-content {
    padding: 0 12px 10px 12px;
    padding-top: 8px;
  }
  
  .info-main {
    font-size: 12px;
    margin-bottom: 3px;
  }
  
  .info-sub {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .phonetic-comparison {
    padding: 6px 8px;
  }

  .comparison-title {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .comparison-item {
    padding: 3px 6px;
    gap: 6px;
  }

  .comparison-item .word {
    font-size: 11px;
    min-width: 60px;
  }

  .comparison-item .phonetic {
    font-size: 11px;
    padding: 1px 4px;
  }

  .comparison-note {
    font-size: 10px;
    margin-top: 4px;
  }

  .section-title {
    font-size: 20px;
  }

  .section-icon {
    font-size: 22px;
    width: 38px;
    height: 38px;
  }

  .phoneme-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 12px 10px;
  }

  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .subsection-title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .phoneme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .empty-state {
    padding: 48px 16px;
  }

  .footer-content {
    flex-direction: column;
    gap: 6px;
  }

  .footer-divider {
    display: none;
  }

  .status-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .clear-search-btn {
    width: 100%;
    justify-content: center;
    min-height: 32px;
  }

  .info-card {
    margin-bottom: 12px;
  }

  .info-header {
    padding: 6px 10px;
  }

  .info-icon-wrapper {
    width: 22px;
    height: 22px;
  }

  .info-icon-wrapper svg {
    width: 12px;
    height: 12px;
  }

  .info-header-title {
    font-size: 11px;
  }

  .info-content {
    padding: 0 10px 8px 10px;
    padding-top: 6px;
  }

  .info-main {
    font-size: 11px;
    margin-bottom: 2px;
  }

  .info-sub {
    font-size: 10px;
    margin-bottom: 4px;
  }

  .phonetic-comparison {
    padding: 4px 6px;
    margin-top: 4px;
  }

  .comparison-title {
    font-size: 10px;
    margin-bottom: 3px;
  }

  .comparison-items {
    gap: 3px;
  }

  .comparison-item {
    padding: 2px 4px;
    gap: 4px;
  }

  .comparison-item .word {
    font-size: 10px;
    min-width: 55px;
  }

  .comparison-item .phonetic {
    font-size: 10px;
    padding: 0 3px;
  }

  .comparison-note {
    font-size: 9px;
    margin-top: 3px;
  }

  .phonemes-section {
    margin-bottom: 32px;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-icon {
    font-size: 18px;
    width: 34px;
    height: 34px;
  }

  .section-count {
    font-size: 11px;
    padding: 3px 8px;
  }

  .subsection {
    margin-bottom: 20px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .phoneme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .main-title {
    font-size: 20px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .play-all-btn {
    transition: none;
  }
  
  .search-input {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .info-card {
    border-width: 2px;
  }
  
  .empty-state {
    border-width: 3px;
  }
}
</style>

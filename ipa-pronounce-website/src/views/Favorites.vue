<template>
  <div class="favorites-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="title">收藏夹</h1>
        <p class="subtitle">您收藏的音标将显示在这里，方便随时复习</p>
      </div>
      
      <div class="header-actions" v-if="favoritePhonemes.length > 0">
        <button class="clear-btn" @click="clearAllFavorites">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          <span>清空收藏</span>
        </button>
      </div>
    </header>

    <div class="stats-card" v-if="favoritePhonemes.length > 0">
      <div class="stat-item">
        <div class="stat-number">{{ favoritePhonemes.length }}</div>
        <div class="stat-label">收藏总数</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ favoriteVowels.length }}</div>
        <div class="stat-label">元音</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ favoriteConsonants.length }}</div>
        <div class="stat-label">辅音</div>
      </div>
    </div>

    <div class="favorites-content">
      <div v-if="favoritePhonemes.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <h2>暂无收藏的音标</h2>
        <p>在音标卡片上点击收藏按钮，将音标添加到这里</p>
        <router-link to="/" class="go-home-btn">去发现音标</router-link>
      </div>

      <div v-else>
        <section class="category-section" v-if="favoriteVowels.length > 0">
          <h2 class="section-title">
            <span class="icon">🗣️</span>
            元音
            <span class="count">{{ favoriteVowels.length }}个</span>
          </h2>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in favoriteVowels"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </section>

        <section class="category-section" v-if="favoriteConsonants.length > 0">
          <h2 class="section-title">
            <span class="icon">🔤</span>
            辅音
            <span class="count">{{ favoriteConsonants.length }}个</span>
          </h2>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in favoriteConsonants"
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </section>
      </div>
    </div>

    <div class="tips-section" v-if="favoritePhonemes.length === 0">
      <h3>如何收藏音标</h3>
      <div class="tips-content">
        <p>1. 在首页找到想要收藏的音标卡片</p>
        <p>2. 点击卡片底部的「收藏」按钮</p>
        <p>3. 收藏的音标会自动保存，方便随时复习</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 收藏夹视图组件
 * 文件用途：展示用户收藏的音标，支持清空收藏
 * 创建日期：2026-02-17
 * 输入：无
 * 输出：收藏夹页面
 * 依赖：Vue 3, Pinia store, PhonemeCard组件
 */

import { computed, onMounted, onUnmounted, watch } from 'vue';
import { usePhonemeStore } from '@/stores/phonemes';
import PhonemeCard from '@/components/PhonemeCard.vue';

console.log('%c━━━━━━━━━━━━━━━━ Favorites.vue ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
console.log('%c📄 Favorites.vue 脚本开始执行', 'color: #8b5cf6; font-weight: bold;')

const store = usePhonemeStore();

console.log('%c📊 Favorites.vue 响应式变量初始化...', 'color: #f59e0b;')

const favoritePhonemes = computed(() => store.favoritePhonemes);
const favoriteVowels = computed(() => favoritePhonemes.value.filter(p => p.type === 'vowel'));
const favoriteConsonants = computed(() => favoritePhonemes.value.filter(p => p.type === 'consonant'));

console.log('%c✅ 计算属性初始化完成', 'color: #10b981;')

watch(favoritePhonemes, (newVal, oldVal) => {
  console.log('%c━━━━━━━━━━━━━━━━ 收藏列表变化 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  console.log(`%c⭐ 收藏列表更新: ${oldVal?.length || 0} → ${newVal.length} 个`, 'color: #f59e0b;')
  
  if (newVal.length > oldVal?.length) {
    const added = newVal.filter(p => !oldVal?.some(op => op.symbol === p.symbol))
    console.log(`%c❤️ 新增收藏:`, 'color: #ef4444;')
    added.forEach(p => console.log(`%c   + ${p.symbol} (${p.chineseName})`, 'color: #ef4444;'))
  } else if (newVal.length < oldVal?.length) {
    const removed = oldVal?.filter(p => !newVal.some(np => np.symbol === p.symbol))
    console.log(`%c💔 移除收藏:`, 'color: #64748b;')
    removed?.forEach(p => console.log(`%c   - ${p.symbol} (${p.chineseName})`, 'color: #64748b;'))
  }
  
  console.log(`%c📊 当前收藏统计:`, 'color: #64748b;')
  console.log(`%c   元音: ${favoriteVowels.value.length} 个`, 'color: #10b981;')
  console.log(`%c   辅音: ${favoriteConsonants.value.length} 个`, 'color: #3b82f6;')
}, { deep: true })

watch(favoriteVowels, (newVal, oldVal) => {
  console.log(`%c🗣️ 收藏元音更新: ${oldVal?.length || 0} → ${newVal.length} 个`, 'color: #10b981;')
  if (newVal.length > 0) {
    console.log(`%c   元音列表: ${newVal.map(p => p.symbol).join(', ')}`, 'color: #64748b;')
  }
})

watch(favoriteConsonants, (newVal, oldVal) => {
  console.log(`%c🔤 收藏辅音更新: ${oldVal?.length || 0} → ${newVal.length} 个`, 'color: #3b82f6;')
  if (newVal.length > 0) {
    console.log(`%c   辅音列表: ${newVal.map(p => p.symbol).join(', ')}`, 'color: #64748b;')
  }
})

const clearAllFavorites = () => {
  console.log('%c━━━━━━━━━━━━━━━━ 清空收藏 ━━━━━━━━━━━━━━━━', 'color: #ef4444; font-weight: bold;')
  console.log('%c🗑️ 用户点击清空收藏按钮', 'color: #ef4444; font-weight: bold;')
  console.log(`%c📊 当前收藏数量: ${favoritePhonemes.value.length}`, 'color: #64748b;')
  console.log(`%c📊 元音: ${favoriteVowels.value.length} 个`, 'color: #64748b;')
  console.log(`%c📊 辅音: ${favoriteConsonants.value.length} 个`, 'color: #64748b;')
  
  if (favoritePhonemes.value.length === 0) {
    console.log('%cℹ️ 收藏夹已为空，无需清空', 'color: #64748b;')
    return
  }
  
  console.log('%c⏳ 弹出确认对话框...', 'color: #f59e0b;')
  
  if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
    console.log('%c✅ 用户确认清空收藏', 'color: #ef4444;')
    console.log(`%c🗑️ 正在清空 ${favoritePhonemes.value.length} 个收藏...`, 'color: #ef4444;')
    
    const beforeCount = favoritePhonemes.value.length
    store.clearFavorites();
    
    console.log(`%c✅ 已清空 ${beforeCount} 个收藏`, 'color: #10b981;')
    console.log('%c💾 localStorage 已更新', 'color: #10b981;')
  } else {
    console.log('%c❌ 用户取消清空收藏', 'color: #64748b;')
  }
};

const handleGoHome = () => {
  console.log('%c🏠 用户点击"去发现音标"按钮', 'color: #3b82f6;')
}

onMounted(() => {
  console.log('%c━━━━━━━━━━━━━━━━ Favorites.vue 挂载 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
  console.log('%c⭐ Favorites.vue 组件开始挂载...', 'color: #10b981;')
  
  const mountStartTime = performance.now()
  
  console.log('%c⏳ 正在加载收藏数据...', 'color: #f59e0b;')
  store.initializeStore();
  
  console.log('%c━━━━━━━━━━━━━━━━ 收藏统计 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log(`%c📊 当前收藏数量: ${favoritePhonemes.value.length}`, 'color: #10b981;')
  console.log(`%c📊 元音: ${favoriteVowels.value.length} 个`, 'color: #10b981;')
  console.log(`%c📊 辅音: ${favoriteConsonants.value.length} 个`, 'color: #10b981;')
  
  if (favoritePhonemes.value.length > 0) {
    console.log('%c📋 收藏的音标列表:', 'color: #3b82f6;')
    favoritePhonemes.value.forEach((p, i) => {
      const typeIcon = p.type === 'vowel' ? '🗣️' : '🔤'
      console.log(`%c   ${i + 1}. ${typeIcon} ${p.symbol} - ${p.chineseName} (${p.category})`, 'color: #64748b;')
    })
  } else {
    console.log('%c📭 收藏夹为空', 'color: #64748b;')
  }
  
  const mountEndTime = performance.now()
  console.log(`%c⏱️ Favorites.vue 挂载耗时: ${(mountEndTime - mountStartTime).toFixed(2)}ms`, 'color: #10b981;')
  console.log('%c✅ Favorites.vue 组件挂载完成', 'color: #10b981; font-weight: bold;')
})

onUnmounted(() => {
  console.log('%c━━━━━━━━━━━━━━━━ Favorites.vue 卸载 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  console.log('%c👋 Favorites.vue 组件开始卸载...', 'color: #f59e0b;')
  console.log(`%c📊 当前收藏数量: ${favoritePhonemes.value.length}`, 'color: #64748b;')
  console.log('%c✅ Favorites.vue 组件卸载完成', 'color: #f59e0b;')
})
</script>

<style scoped>
.favorites-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn svg {
  width: 18px;
  height: 18px;
}

.clear-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.stats-card {
  display: flex;
  justify-content: center;
  gap: 48px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #3b82f6;
  font-family: 'Georgia', serif;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.favorites-content {
  margin-bottom: 32px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 24px;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

.go-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.go-home-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.category-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.section-title .icon {
  font-size: 24px;
}

.section-title .count {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 20px;
}

.phoneme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.tips-section {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.tips-section h3 {
  font-size: 18px;
  color: #92400e;
  margin: 0 0 16px 0;
}

.tips-content p {
  font-size: 14px;
  color: #78350f;
  margin: 8px 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .favorites-page {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .title {
    font-size: 26px;
  }
  
  .clear-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-card {
    gap: 24px;
    padding: 16px;
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .phoneme-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 12px;
  }
  
  .stats-card {
    flex-direction: column;
    gap: 16px;
  }
}

[data-theme="dark"] .title {
  color: #e2e8f0;
}

[data-theme="dark"] .subtitle {
  color: #94a3b8;
}

[data-theme="dark"] .page-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .clear-btn {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

[data-theme="dark"] .clear-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

[data-theme="dark"] .stats-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%);
  border-color: rgba(59, 130, 246, 0.3);
}

[data-theme="dark"] .stat-number {
  color: #60a5fa;
}

[data-theme="dark"] .stat-label {
  color: #94a3b8;
}

[data-theme="dark"] .empty-state {
  background: #1e293b;
  border-color: #334155;
}

[data-theme="dark"] .empty-state h2 {
  color: #e2e8f0;
}

[data-theme="dark"] .empty-state p {
  color: #94a3b8;
}

[data-theme="dark"] .section-title {
  color: #e2e8f0;
}

[data-theme="dark"] .section-title .count {
  background: #334155;
  color: #94a3b8;
}

[data-theme="dark"] .phoneme-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

[data-theme="dark"] .tips-section {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

[data-theme="dark"] .tips-section h3 {
  color: #fcd34d;
}

[data-theme="dark"] .tips-content p {
  color: #fbbf24;
}

@media (max-width: 768px) {
  [data-theme="dark"] .phoneme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>

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
import { computed, onMounted } from 'vue';
import { usePhonemeStore } from '@/stores/phonemes';
import PhonemeCard from '@/components/PhonemeCard.vue';

const store = usePhonemeStore();

const favoritePhonemes = computed(() => store.favoritePhonemes);
const favoriteVowels = computed(() => favoritePhonemes.value.filter(p => p.type === 'vowel'));
const favoriteConsonants = computed(() => favoritePhonemes.value.filter(p => p.type === 'consonant'));

const clearAllFavorites = () => {
  if (confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
    store.clearFavorites();
  }
};

onMounted(() => {
  store.initializeStore();
});
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
</style>

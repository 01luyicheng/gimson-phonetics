<template>
  <div class="home-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="title">英语国际音标</h1>
        <p class="subtitle">English IPA · 44 Phonemes</p>
      </div>
      
      <div class="header-actions">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索音标、单词..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <button 
          class="play-all-btn"
          :class="{ playing: playAllMode }"
          @click="handlePlayAll"
        >
          <svg v-if="!playAllMode" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <span>{{ playAllMode ? '停止播放' : '播放全部' }}</span>
        </button>
      </div>
    </header>

    <div class="info-banner" v-if="!searchQuery">
      <div class="info-content">
        <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <div class="info-text">
          <p>本页面展示的是<strong>英语（英式）中使用的44个国际音标</strong>，采用Gimson音标系统（符合国内英语教学习惯）。</p>
          <p class="info-note">国际音标(IPA)包含约107个基础字母和50多个附加符号，可标注世界上所有语言的发音。如需查看完整IPA，请<a href="https://www.internationalphoneticassociation.org/IPAcharts/IPA_chart_orig/IPA_charts_E.html" target="_blank" rel="noopener">访问国际语音学会官网</a>。</p>
        </div>
      </div>
    </div>

    <div class="search-results-info" v-if="searchQuery">
      <span>找到 <strong>{{ filteredPhonemes.length }}</strong> 个结果</span>
      <button class="clear-search-btn" @click="clearSearch">清除搜索</button>
    </div>

    <div class="search-no-results" v-if="searchQuery && filteredPhonemes.length === 0">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <p>未找到匹配的音标</p>
      <span>试试其他关键词，如：/iː/、/ə/、cat、see</span>
    </div>

    <template v-if="searchQuery">
      <section class="phonemes-section search-results">
        <div class="phoneme-grid">
          <PhonemeCard 
            v-for="phoneme in filteredPhonemes" 
            :key="phoneme.symbol"
            :phoneme="phoneme"
          />
        </div>
      </section>
    </template>

    <template v-else>
      <section class="phonemes-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🗣️</span>
            元音 · Vowels
            <span class="count">{{ vowelCount }}个</span>
          </h2>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">单元音 · Monophthongs</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in monophthongs" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">双元音 · Diphthongs</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in diphthongs" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
      </section>

      <section class="phonemes-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🔤</span>
            辅音 · Consonants
            <span class="count">{{ consonantCount }}个</span>
          </h2>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">爆破音 · Plosives</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in plosives" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">摩擦音 · Fricatives</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in fricatives" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">破擦音 · Affricates</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in affricates" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">鼻音 · Nasals</h3>
          <div class="phoneme-grid">
            <PhonemeCard 
              v-for="phoneme in nasals" 
              :key="phoneme.symbol"
              :phoneme="phoneme"
            />
          </div>
        </div>
        
        <div class="subsection">
          <h3 class="subsection-title">近音 · Approximants</h3>
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

    <footer class="page-footer">
      <p>音频来源：<a href="https://ipachart.app" target="_blank" rel="noopener">ipachart.app</a></p>
      <p>点击示例单词可听取发音（使用浏览器语音合成）</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
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

const store = usePhonemeStore();

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value) => { store.searchQuery = value; }
});

const filteredPhonemes = computed(() => store.filteredPhonemes);
const playAllMode = computed(() => store.playAllMode);

const clearSearch = () => {
  store.searchQuery = '';
};

const handlePlayAll = () => {
  store.playAllPhonemes();
};

onMounted(() => {
  store.initializeStore();
});
</script>

<style scoped>
.home-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
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
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  padding: 12px 40px 12px 44px;
  width: 280px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.clear-search {
  position: absolute;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
}

.clear-search svg {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.clear-search:hover {
  background: #cbd5e1;
}

.play-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-all-btn svg {
  width: 20px;
  height: 20px;
}

.play-all-btn:hover {
  background: #2563eb;
}

.play-all-btn.playing {
  background: #ef4444;
}

.play-all-btn.playing:hover {
  background: #dc2626;
}

.info-banner {
  background: #fef3c7;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 32px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.info-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-icon {
  width: 24px;
  height: 24px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  flex: 1;
}

.info-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
}

.info-text p:last-child {
  margin-bottom: 0;
}

.info-text strong {
  color: #92400e;
}

.info-note {
  font-size: 13px !important;
  color: #92400e !important;
  opacity: 0.9;
}

.info-note a {
  color: #d97706;
  text-decoration: underline;
  font-weight: 500;
}

.info-note a:hover {
  color: #b45309;
}

.search-results-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.search-results-info span {
  font-size: 14px;
  color: #1e293b;
}

.search-results-info strong {
  color: #3b82f6;
}

.clear-search-btn {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: #3b82f6;
  color: white;
}

.search-no-results {
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
}

.search-no-results svg {
  width: 48px;
  height: 48px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.search-no-results p {
  font-size: 18px;
  color: #1e293b;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.search-no-results span {
  font-size: 14px;
  color: #64748b;
}

.phonemes-section {
  margin-bottom: 40px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
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

.subsection {
  margin-bottom: 28px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 16px 0;
  padding-left: 12px;
  border-left: 3px solid #cbd5e1;
}

.phoneme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.page-footer {
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 40px;
}

.page-footer p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #94a3b8;
}

.page-footer p:last-child {
  margin-bottom: 0;
}

.page-footer a {
  color: #64748b;
  text-decoration: underline;
}

.page-footer a:hover {
  color: #475569;
}

@media (max-width: 768px) {
  .home-page {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .title {
    font-size: 26px;
  }
  
  .play-all-btn {
    width: 100%;
    justify-content: center;
  }
  
  .info-banner {
    padding: 14px 16px;
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
  
  .subsection-title {
    font-size: 14px;
  }
}
</style>

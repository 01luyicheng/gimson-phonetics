<template>
  <div 
    class="phoneme-card"
    :class="{
      'is-playing': isPlaying,
      'is-looping': isLooping,
      'is-vowel': phoneme.type === 'vowel',
      'is-consonant': phoneme.type === 'consonant'
    }"
  >
    <div class="card-main">
      <div class="symbol-section">
        <span class="symbol">{{ phoneme.symbol }}</span>
        <span class="type-badge" :class="phoneme.category">
          {{ categoryLabel }}
        </span>
      </div>
      
      <div class="name-section">
        <span class="chinese-name">{{ phoneme.chineseName }}</span>
        <span class="english-name">{{ phoneme.englishName }}</span>
      </div>
      
      <div class="position-info" v-if="positionLabel">
        <span class="position-label">发音部位：</span>
        <span class="position-value">{{ positionLabel }}</span>
      </div>
      
      <div class="description">
        {{ phoneme.description }}
      </div>
      
      <div class="examples">
        <span class="examples-label">示例单词：</span>
        <div class="examples-list">
          <button 
            v-for="(example, index) in phoneme.examples" 
            :key="index"
            class="example-word"
            @click="speakWord(example)"
          >
            {{ example }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-actions">
      <button 
        class="action-btn play-btn"
        :class="{ active: isPlaying && !isLooping }"
        @click="handlePlay"
        :title="playButtonTitle"
      >
        <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <span>{{ playButtonText }}</span>
      </button>
      
      <button 
        class="action-btn loop-btn"
        :class="{ active: isLooping }"
        @click="handleLoop"
        :title="loopButtonTitle"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        <span>循环</span>
      </button>
      
      <button 
        class="action-btn favorite-btn"
        :class="{ active: isFavorite }"
        @click="handleFavorite"
        :title="isFavorite ? '取消收藏' : '收藏'"
      >
        <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
        </svg>
        <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
      </button>
    </div>
    
    <div class="playing-indicator" v-if="isPlaying">
      <div class="wave">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePhonemeStore } from '@/stores/phonemes';
import { getCategoryLabel, getPositionLabel } from '@/data/ipa-data';

const props = defineProps({
  phoneme: {
    type: Object,
    required: true
  }
});

const store = usePhonemeStore();

const isPlaying = computed(() => store.isCurrentPlaying(props.phoneme.symbol));
const isLooping = computed(() => store.isCurrentLooping(props.phoneme.symbol));
const isFavorite = computed(() => store.isFavorite(props.phoneme.symbol));

const categoryLabel = computed(() => getCategoryLabel(props.phoneme.category));
const positionLabel = computed(() => getPositionLabel(props.phoneme.position));

const playButtonText = computed(() => {
  return (isPlaying.value || isLooping.value) ? '停止' : '播放';
});

const playButtonTitle = computed(() => {
  if (isLooping.value) return '停止循环播放';
  if (isPlaying.value) return '停止播放';
  return '播放一次';
});

const loopButtonTitle = computed(() => {
  if (isLooping.value) return '停止循环播放';
  if (isPlaying.value) return '切换为循环播放';
  return '开始循环播放';
});

const handlePlay = () => {
  if (isPlaying.value || isLooping.value) {
    store.stopPlaying();
  } else {
    store.playPhoneme(props.phoneme, false);
  }
};

const handleLoop = () => {
  store.toggleLoop(props.phoneme);
};

const handleFavorite = () => {
  store.toggleFavorite(props.phoneme.symbol);
};

const wordAudio = ref(null);

const speakWord = (word) => {
  if (wordAudio.value) {
    wordAudio.value.pause();
    wordAudio.value.currentTime = 0;
  }
  
  const audioPath = `/word-audio/${word}.mp3`;
  const audio = new Audio(audioPath);
  wordAudio.value = audio;
  
  audio.onerror = () => {
    console.error(`单词发音加载失败: ${word}`);
  };
  
  audio.play().catch(err => {
    console.error('单词发音播放失败:', err);
  });
};
</script>

<style scoped>
.phoneme-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.phoneme-card.is-playing {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.phoneme-card.is-looping {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.phoneme-card.is-vowel .symbol {
  color: #059669;
}

.phoneme-card.is-consonant .symbol {
  color: #2563eb;
}

.card-main {
  margin-bottom: 12px;
}

.symbol-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.symbol {
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
}

.type-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.monophthong {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.type-badge.diphthong {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.type-badge.plosive {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.type-badge.fricative {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #9d174d;
}

.type-badge.affricate {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
}

.type-badge.nasal {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #6b21a8;
}

.type-badge.approximant {
  background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
  color: #115e59;
}

.name-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.chinese-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.english-name {
  font-size: 11px;
  color: #64748b;
  font-style: italic;
}

.position-info {
  font-size: 12px;
  color: #475569;
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
}

.position-label {
  color: #94a3b8;
}

.position-value {
  font-weight: 500;
}

.description {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 8px;
}

.examples {
  margin-bottom: 4px;
}

.examples-label {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-bottom: 6px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.example-word {
  font-size: 12px;
  padding: 4px 10px;
  background: #f1f5f9;
  border: none;
  border-radius: 20px;
  color: #334155;
  cursor: pointer;
  font-weight: 500;
}

.example-word:hover {
  background: #3b82f6;
  color: white;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  border: none;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.play-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.action-btn.loop-btn.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-btn.favorite-btn.active {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.playing-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
}

.wave {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 16px;
}

.wave span {
  width: 3px;
  height: 12px;
  background: #3b82f6;
  border-radius: 3px;
}

@media (max-width: 640px) {
  .phoneme-card {
    padding: 14px;
  }
  
  .symbol {
    font-size: 32px;
  }
  
  .card-actions {
    gap: 6px;
  }
  
  .action-btn {
    padding: 8px 6px;
    font-size: 10px;
  }
  
  .action-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>

<template>
  <div class="audio-player" v-if="phoneme">
    <div class="player-controls">
      <button
        class="play-btn"
        :class="{ playing: isPlaying }"
        @click="handlePlay"
        :title="isPlaying ? '暂停' : '播放'"
      >
        <el-icon v-if="!isPlaying"><VideoPlay /></el-icon>
        <el-icon v-else><VideoPause /></el-icon>
      </button>

      <button
        class="loop-btn"
        :class="{ active: isLooping }"
        @click="handleLoop"
        title="循环播放"
      >
        <el-icon><RefreshRight /></el-icon>
      </button>

      <button
        class="favorite-btn"
        :class="{ active: isFavorite(phoneme.symbol) }"
        @click="handleFavorite"
        :title="isFavorite(phoneme.symbol) ? '取消收藏' : '收藏'"
      >
        <el-icon v-if="isFavorite(phoneme.symbol)"><StarFilled /></el-icon>
        <el-icon v-else><Star /></el-icon>
      </button>
    </div>

    <div class="phoneme-display">
      <div class="phoneme-symbol">{{ phoneme.symbol }}</div>
      <div class="phoneme-name">{{ phoneme.name }}</div>
    </div>

    <div class="player-info">
      <div class="info-item">
        <span class="label">类型:</span>
        <span class="value">{{ phoneme.type === 'vowel' ? '元音' : '辅音' }}</span>
      </div>
      <div class="info-item">
        <span class="label">分类:</span>
        <span class="value">{{ getCategoryLabel(phoneme.category) }}</span>
      </div>
      <div class="info-item" v-if="phoneme.position">
        <span class="label">位置:</span>
        <span class="value">{{ getPositionLabel(phoneme.position) }}</span>
      </div>
      <div class="info-item" v-if="phoneme.rounded !== undefined">
        <span class="label">圆唇:</span>
        <span class="value">{{ phoneme.rounded ? '是' : '否' }}</span>
      </div>
    </div>

    <div class="description" v-if="phoneme.description">
      {{ phoneme.description }}
    </div>

    <div class="examples" v-if="phoneme.examples && phoneme.examples.length">
      <h4>单词示例:</h4>
      <div class="example-list">
        <span
          v-for="(example, index) in phoneme.examples"
          :key="index"
          class="example-tag"
          @click="speakExample(example)"
        >
          {{ example }}
        </span>
      </div>
    </div>

    <div class="difficulty" v-if="phoneme.difficulty">
      <span class="label">难度:</span>
      <el-rate
        v-model="phoneme.difficulty"
        disabled
        :max="5"
        :colors="['#409EFF', '#409EFF', '#409EFF']"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElIcon, ElRate } from 'element-plus';
import { VideoPlay, VideoPause, RefreshRight, Star, StarFilled } from '@element-plus/icons-vue';
import { usePhonemeStore } from '@/stores/phonemes';

const props = defineProps({
  phoneme: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['play', 'favorite', 'loop']);

const store = usePhonemeStore();

const isPlaying = computed(() => store.isPlaying);
const isLooping = computed(() => store.isLooping);

const handlePlay = () => {
  if (isPlaying.value) {
    store.stopPlaying();
  } else {
    store.playPhoneme(props.phoneme);
  }
  emit('play', props.phoneme);
};

const handleLoop = () => {
  store.toggleLoop();
  emit('loop');
};

const handleFavorite = () => {
  store.toggleFavorite(props.phoneme.symbol);
  emit('favorite', props.phoneme.symbol);
};

const isFavorite = (symbol) => {
  return store.isFavorite(symbol);
};

const getCategoryLabel = (category) => {
  const labels = {
    'close': '闭元音',
    'near-close': '次闭元音',
    'close-mid': '半闭元音',
    'mid': '中元音',
    'open-mid': '半开元音',
    'near-open': '次开元音',
    'open': '开元音',
    'diphthong': '双元音',
    'plosive': '爆破音',
    'fricative': '摩擦音',
    'affricate': '破擦音',
    'nasal': '鼻音',
    'approximant': '近音',
    'click': '点击音',
    'ejective': '挤喉音',
    'implosive': '内爆音'
  };
  return labels[category] || category;
};

const getPositionLabel = (position) => {
  const labels = {
    'front': '前部',
    'near-front': '近前部',
    'central': '中部',
    'back': '后部',
    'near-back': '近后部',
    'bilabial': '双唇',
    'labiodental': '唇齿',
    'dental': '齿间',
    'alveolar': '齿龈',
    'postalveolar': '后齿龈',
    'palatal': '硬腭',
    'velar': '软腭',
    'glottal': '声门',
    'uvular': '小舌',
    'pharyngeal': '咽部',
    'retroflex': '卷舌',
    'labio-velar': '唇软腭',
    'labial-palatal': '唇硬腭',
    'alveolo-palatal': '齿龈硬腭',
    'dorso-palatal-velar': '背腭软腭',
    'epiglottal': '会厌'
  };
  return labels[position] || position;
};

const speakExample = (word) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
};
</script>

<style scoped>
.audio-player {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.player-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.play-btn,
.loop-btn,
.favorite-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
}

.play-btn:hover,
.loop-btn:hover,
.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.play-btn.playing {
  background: #ff6b6b;
}

.loop-btn.active {
  background: #51cf66;
}

.favorite-btn.active {
  background: #ffd43b;
  color: #333;
}

.phoneme-display {
  text-align: center;
  margin-bottom: 20px;
}

.phoneme-symbol {
  font-size: 48px;
  font-weight: bold;
  font-family: 'Georgia', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.phoneme-name {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.player-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.label {
  opacity: 0.8;
  min-width: 50px;
}

.value {
  font-weight: 500;
}

.description {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.examples {
  margin-bottom: 16px;
}

.examples h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.9;
}

.example-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.example-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

:deep(.el-rate) {
  --el-rate-icon-size: 16px;
}

@media (max-width: 768px) {
  .audio-player {
    padding: 16px;
  }

  .phoneme-symbol {
    font-size: 36px;
  }

  .player-info {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="vowels-view">
    <div class="page-header">
      <h1>元音 (Vowels)</h1>
      <p class="subtitle">英语元音共20个，包括单元音和双元音</p>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">单元音/双元音:</span>
        <el-radio-group v-model="vowelType" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="monophthongs">单元音</el-radio-button>
          <el-radio-button label="diphthongs">双元音</el-radio-button>
        </el-radio-group>
      </div>

      <div class="filter-group">
        <span class="filter-label">位置:</span>
        <el-radio-group v-model="positionFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="front">前</el-radio-button>
          <el-radio-button label="central">中</el-radio-button>
          <el-radio-button label="back">后</el-radio-button>
        </el-radio-group>
      </div>

      <div class="filter-group">
        <span class="filter-label">难度:</span>
        <el-radio-group v-model="difficultyFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="1">简单</el-radio-button>
          <el-radio-button label="2">中等</el-radio-button>
          <el-radio-button label="3">较难</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 音标列表 -->
    <div class="phoneme-list">
      <div v-if="filteredVowels.length === 0" class="empty-state">
        <el-empty description="没有找到匹配的音标" />
      </div>

      <div v-else class="phoneme-grid">
        <PhonemeCard
          v-for="phoneme in filteredVowels"
          :key="phoneme.symbol"
          :phoneme="phoneme"
          @click="selectPhoneme"
        />
      </div>
    </div>

    <!-- 选中音标详情 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedPhoneme?.name"
      width="90%"
      max-width="600px"
      destroy-on-close
    >
      <AudioPlayer v-if="selectedPhoneme" :phoneme="selectedPhoneme" />
    </el-dialog>

    <!-- 快速播放列表 -->
    <div class="playlist-section" v-if="filteredVowels.length > 0">
      <h3>快速播放</h3>
      <div class="playlist-controls">
        <el-button type="primary" @click="playAll" :loading="isPlayingAll">
          <el-icon><VideoPlay /></el-icon>
          播放全部
        </el-button>
        <el-button @click="stopAll">
          <el-icon><VideoPause /></el-icon>
          停止
        </el-button>
        <el-button @click="toggleLoopAll" :type="loopAll ? 'success' : 'default'">
          <el-icon><RefreshRight /></el-icon>
          循环播放
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElRadioGroup, ElRadioButton, ElButton, ElDialog, ElIcon, ElEmpty } from 'element-plus';
import { VideoPlay, VideoPause, RefreshRight } from '@element-plus/icons-vue';
import { usePhonemeStore } from '@/stores/phonemes';
import PhonemeCard from '@/components/PhonemeCard.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

const store = usePhonemeStore();

const vowelType = ref('all');
const positionFilter = ref('all');
const difficultyFilter = ref('all');
const dialogVisible = ref(false);
const selectedPhoneme = ref(null);
const isPlayingAll = ref(false);
const loopAll = ref(false);
let currentAudio = null;

const vowels = computed(() => {
  return store.phonemes.filter(p => p.type === 'vowel' && p.isEnglish);
});

const filteredVowels = computed(() => {
  let result = vowels.value;

  // 过滤单元音/双元音
  if (vowelType.value === 'monophthongs') {
    result = result.filter(v => v.category !== 'diphthong');
  } else if (vowelType.value === 'diphthongs') {
    result = result.filter(v => v.category === 'diphthong');
  }

  // 过滤位置
  if (positionFilter.value !== 'all') {
    result = result.filter(v => {
      if (positionFilter.value === 'front') {
        return v.position.includes('front');
      } else if (positionFilter.value === 'central') {
        return v.position.includes('central');
      } else if (positionFilter.value === 'back') {
        return v.position.includes('back');
      }
      return true;
    });
  }

  // 过滤难度
  if (difficultyFilter.value !== 'all') {
    result = result.filter(v => v.difficulty === parseInt(difficultyFilter.value));
  }

  return result;
});

const selectPhoneme = (phoneme) => {
  selectedPhoneme.value = phoneme;
  dialogVisible.value = true;
};

const playAll = async () => {
  if (isPlayingAll.value) return;

  isPlayingAll.value = true;
  const phonemes = filteredVowels.value;

  for (let i = 0; i < phonemes.length; i++) {
    if (!isPlayingAll.value) break;

    const phoneme = phonemes[i];
    store.playPhoneme(phoneme);

    // 等待音频播放完成
    await new Promise(resolve => {
      const audio = new Audio(store.getAudioUrl(phoneme.audioFile));
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play();

      currentAudio = audio;
    });

    // 短暂间隔
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // 循环播放
  if (loopAll.value && isPlayingAll.value) {
    playAll();
  } else {
    isPlayingAll.value = false;
  }
};

const stopAll = () => {
  isPlayingAll.value = false;
  store.stopPlaying();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
};

const toggleLoopAll = () => {
  loopAll.value = !loopAll.value;
};

onMounted(() => {
  store.initializeStore();
});
</script>

<style scoped>
.vowels-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-header h1 {
  color: var(--text-color);
  font-size: 32px;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--text-color-secondary);
  font-size: 16px;
}

/* Filters */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-color-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: var(--text-color-secondary);
  font-weight: 500;
}

/* Phoneme List */
.phoneme-list {
  margin-bottom: 24px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.phoneme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* Playlist Section */
.playlist-section {
  background: var(--bg-color-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.playlist-section h3 {
  margin: 0 0 16px 0;
  color: var(--text-color);
  font-size: 18px;
}

.playlist-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .vowels-view {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .filters {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .phoneme-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .playlist-controls {
    flex-direction: column;
  }

  .playlist-controls .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .phoneme-grid {
    grid-template-columns: 1fr;
  }
}
</style>

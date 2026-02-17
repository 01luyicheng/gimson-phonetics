<template>
  <div class="consonants-view">
    <div class="page-header">
      <h1>辅音 (Consonants)</h1>
      <p class="subtitle">英语辅音共24个，包括爆破音、摩擦音、破擦音、鼻音和近音</p>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <span class="filter-label">类别:</span>
        <el-radio-group v-model="categoryFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="plosive">爆破音</el-radio-button>
          <el-radio-button label="fricative">摩擦音</el-radio-button>
          <el-radio-button label="affricate">破擦音</el-radio-button>
          <el-radio-button label="nasal">鼻音</el-radio-button>
          <el-radio-button label="approximant">近音</el-radio-button>
        </el-radio-group>
      </div>

      <div class="filter-group">
        <span class="filter-label">清浊:</span>
        <el-radio-group v-model="voicingFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="voiceless">清辅音</el-radio-button>
          <el-radio-button label="voiced">浊辅音</el-radio-button>
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
      <div v-if="filteredConsonants.length === 0" class="empty-state">
        <el-empty description="没有找到匹配的音标" />
      </div>

      <div v-else class="phoneme-grid">
        <PhonemeCard
          v-for="phoneme in filteredConsonants"
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
    <div class="playlist-section" v-if="filteredConsonants.length > 0">
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

    <!-- 发音技巧提示 -->
    <div class="tips-section">
      <h3>发音技巧</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <h4>爆破音</h4>
          <p>发音时气流突然释放，形成爆破声。注意声带振动（浊音）或不振动（清音）。</p>
        </div>
        <div class="tip-card">
          <h4>摩擦音</h4>
          <p>发音时气流通过狭窄通道产生摩擦声。注意发音部位的准确性。</p>
        </div>
        <div class="tip-card">
          <h4>破擦音</h4>
          <p>先爆破后摩擦的组合音。注意两个音的连贯性。</p>
        </div>
        <div class="tip-card">
          <h4>鼻音</h4>
          <p>气流通过鼻腔发出。注意软腭下垂，让气流从鼻腔通过。</p>
        </div>
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

const categoryFilter = ref('all');
const voicingFilter = ref('all');
const difficultyFilter = ref('all');
const dialogVisible = ref(false);
const selectedPhoneme = ref(null);
const isPlayingAll = ref(false);
const loopAll = ref(false);
let currentAudio = null;

const consonants = computed(() => {
  return store.phonemes.filter(p => p.type === 'consonant' && p.isEnglish);
});

const filteredConsonants = computed(() => {
  let result = consonants.value;

  // 过滤类别
  if (categoryFilter.value !== 'all') {
    result = result.filter(c => c.category === categoryFilter.value);
  }

  // 过滤清浊
  if (voicingFilter.value !== 'all') {
    const isVoiceless = voicingFilter.value === 'voiceless';
    result = result.filter(c => {
      // 通过名称判断清浊
      const name = c.name || c.englishName || '';
      return isVoiceless ? name.includes('清') || name.includes('Voiceless') : name.includes('浊') || name.includes('Voiced');
    });
  }

  // 过滤难度
  if (difficultyFilter.value !== 'all') {
    result = result.filter(c => c.difficulty === parseInt(difficultyFilter.value));
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
  const phonemes = filteredConsonants.value;

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
.consonants-view {
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
  margin-bottom: 24px;
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

/* Tips Section */
.tips-section {
  background: var(--bg-color-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.tips-section h3 {
  margin: 0 0 16px 0;
  color: var(--text-color);
  font-size: 18px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.tip-card {
  background: var(--bg-color-tertiary);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.tip-card h4 {
  margin: 0 0 8px 0;
  color: var(--primary-color);
  font-size: 16px;
}

.tip-card p {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 14px;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .consonants-view {
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

  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .phoneme-grid {
    grid-template-columns: 1fr;
  }
}
</style>

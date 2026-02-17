<template>
  <div class="favorites-view">
    <div class="page-header">
      <h1>收藏夹</h1>
      <p class="subtitle">您收藏的音标将显示在这里，方便随时复习</p>
    </div>

    <!-- 收藏统计 -->
    <div class="stats-card" v-if="favoritePhonemes.length > 0">
      <div class="stat-item">
        <div class="stat-number">{{ favoritePhonemes.length }}</div>
        <div class="stat-label">收藏总数</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ vowelCount }}</div>
        <div class="stat-label">元音</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ consonantCount }}</div>
        <div class="stat-label">辅音</div>
      </div>
      <div class="stat-item">
        <el-button type="danger" size="small" @click="clearAllFavorites">
          清空收藏
        </el-button>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-list">
      <div v-if="favoritePhonemes.length === 0" class="empty-state">
        <el-empty description="暂无收藏的音标">
          <el-button type="primary" @click="goToHome">去发现音标</el-button>
        </el-empty>
      </div>

      <div v-else>
        <!-- 分类显示 -->
        <div class="category-section" v-if="favoriteVowels.length > 0">
          <h3>元音 ({{ favoriteVowels.length }})</h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in favoriteVowels"
              :key="phoneme.symbol"
              :phoneme="phoneme"
              @click="selectPhoneme"
              @favorite="handleFavoriteChange"
            />
          </div>
        </div>

        <div class="category-section" v-if="favoriteConsonants.length > 0">
          <h3>辅音 ({{ favoriteConsonants.length }})</h3>
          <div class="phoneme-grid">
            <PhonemeCard
              v-for="phoneme in favoriteConsonants"
              :key="phoneme.symbol"
              :phoneme="phoneme"
              @click="selectPhoneme"
              @favorite="handleFavoriteChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速播放 -->
    <div class="playlist-section" v-if="favoritePhonemes.length > 0">
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

    <!-- 提示信息 -->
    <div class="tips-section" v-if="favoritePhonemes.length === 0">
      <h3>如何收藏音标</h3>
      <div class="tips-content">
        <p>1. 在音标卡片上点击 <el-icon><Star /></el-icon> 按钮收藏</p>
        <p>2. 在音标详情页点击收藏按钮</p>
        <p>3. 收藏的音标会永久保存，方便随时复习</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton, ElDialog, ElIcon, ElEmpty } from 'element-plus';
import { VideoPlay, VideoPause, RefreshRight, Star } from '@element-plus/icons-vue';
import { usePhonemeStore } from '@/stores/phonemes';
import PhonemeCard from '@/components/PhonemeCard.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

const router = useRouter();
const store = usePhonemeStore();

const dialogVisible = ref(false);
const selectedPhoneme = ref(null);
const isPlayingAll = ref(false);
const loopAll = ref(false);
let currentAudio = null;

const favoritePhonemes = computed(() => store.favoritePhonemes);
const favoriteVowels = computed(() => favoritePhonemes.value.filter(p => p.type === 'vowel'));
const favoriteConsonants = computed(() => favoritePhonemes.value.filter(p => p.type === 'consonant'));
const vowelCount = computed(() => favoriteVowels.value.length);
const consonantCount = computed(() => favoriteConsonants.value.length);

const selectPhoneme = (phoneme) => {
  selectedPhoneme.value = phoneme;
  dialogVisible.value = true;
};

const handleFavoriteChange = (symbol) => {
  // 如果取消收藏，从列表中移除
  if (!store.isFavorite(symbol)) {
    // 触发重新计算
    store.initializeStore();
  }
};

const clearAllFavorites = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    store.clearFavorites();
  }
};

const goToHome = () => {
  router.push('/');
};

const playAll = async () => {
  if (isPlayingAll.value || favoritePhonemes.value.length === 0) return;

  isPlayingAll.value = true;
  const phonemes = favoritePhonemes.value;

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
.favorites-view {
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

/* Stats Card */
.stats-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg-color-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Georgia', serif;
}

.stat-label {
  font-size: 13px;
  color: var(--text-color-secondary);
  margin-top: 4px;
}

/* Favorites List */
.favorites-list {
  margin-bottom: 24px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.category-section {
  margin-bottom: 32px;
}

.category-section h3 {
  color: var(--text-color);
  margin-bottom: 16px;
  font-size: 18px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
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
  background: linear-gradient(135deg, var(--primary-color) 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.tips-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.tips-content p {
  margin: 8px 0;
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-content .el-icon {
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .favorites-view {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .stats-card {
    flex-direction: column;
    gap: 12px;
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

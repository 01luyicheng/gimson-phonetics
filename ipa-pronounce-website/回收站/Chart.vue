<template>
  <div class="chart-view">
    <div class="page-header">
      <h1>IPA音标图表</h1>
      <p class="subtitle">交互式IPA图表，点击音标即可播放发音</p>
    </div>

    <!-- 图表控制 -->
    <div class="chart-controls">
      <div class="control-group">
        <span class="control-label">显示:</span>
        <el-radio-group v-model="displayMode" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="english">英语</el-radio-button>
          <el-radio-button label="vowels">元音</el-radio-button>
          <el-radio-button label="consonants">辅音</el-radio-button>
        </el-radio-group>
      </div>

      <div class="control-group">
        <span class="control-label">难度:</span>
        <el-radio-group v-model="difficultyFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="1">简单</el-radio-button>
          <el-radio-button label="2">中等</el-radio-button>
          <el-radio-button label="3">较难</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 图表说明 -->
    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-color english"></span>
        <span>英语音标</span>
      </div>
      <div class="legend-item">
        <span class="legend-color favorite"></span>
        <span>已收藏</span>
      </div>
      <div class="legend-item">
        <span class="legend-color playing"></span>
        <span>正在播放</span>
      </div>
    </div>

    <!-- IPA图表 -->
    <IPAChart />

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <el-button type="primary" @click="playAllEnglish">
          <el-icon><VideoPlay /></el-icon>
          播放所有英语音标
        </el-button>
        <el-button @click="resetFilters">
          <el-icon><Refresh /></el-icon>
          重置筛选
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElRadioGroup, ElRadioButton, ElButton, ElDialog, ElIcon } from 'element-plus';
import { VideoPlay, Refresh } from '@element-plus/icons-vue';
import { usePhonemeStore } from '@/stores/phonemes';
import IPAChart from '@/components/IPAChart.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

const store = usePhonemeStore();

const displayMode = ref('all');
const difficultyFilter = ref('all');
const dialogVisible = ref(false);
const selectedPhoneme = ref(null);
const isPlayingAll = ref(false);
let currentAudio = null;

const playAllEnglish = async () => {
  if (isPlayingAll.value) return;

  isPlayingAll.value = true;
  const phonemes = store.englishOnly;

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

  isPlayingAll.value = false;
};

const resetFilters = () => {
  displayMode.value = 'all';
  difficultyFilter.value = 'all';
  store.resetFilters();
};

onMounted(() => {
  store.initializeStore();
});
</script>

<style scoped>
.chart-view {
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

/* Chart Controls */
.chart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-color-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 13px;
  color: var(--text-color-secondary);
  font-weight: 500;
}

/* Legend */
.chart-legend {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--bg-color-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color-light);
  flex-wrap: wrap;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-color-secondary);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.english {
  background: var(--info-color);
}

.legend-color.favorite {
  background: var(--warning-color);
}

.legend-color.playing {
  background: var(--danger-color);
}

/* Quick Actions */
.quick-actions {
  background: var(--bg-color-secondary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px var(--shadow-color-light);
  margin-top: 24px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.quick-actions h3 {
  margin: 0 0 16px 0;
  color: var(--text-color);
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chart-view {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .chart-controls {
    flex-direction: column;
    gap: 12px;
  }

  .control-group {
    flex-wrap: wrap;
  }

  .chart-legend {
    gap: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>

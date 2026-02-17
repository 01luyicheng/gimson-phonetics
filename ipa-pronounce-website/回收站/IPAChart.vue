<template>
  <div class="ipa-chart">
    <div class="chart-header">
      <h2>IPA音标图表</h2>
      <div class="chart-filters">
        <el-radio-group v-model="chartType" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="english">英语</el-radio-button>
          <el-radio-button label="vowels">元音</el-radio-button>
          <el-radio-button label="consonants">辅音</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 元音图表 -->
    <div v-if="chartType === 'all' || chartType === 'vowels'" class="chart-section">
      <h3>元音 (Vowels)</h3>

      <!-- 单元音表格 -->
      <div class="vowel-table">
        <div class="table-row header">
          <div class="table-cell">位置</div>
          <div class="table-cell">闭</div>
          <div class="table-cell">次闭</div>
          <div class="table-cell">半闭</div>
          <div class="table-cell">中</div>
          <div class="table-cell">半开</div>
          <div class="table-cell">次开</div>
          <div class="table-cell">开</div>
        </div>

        <div class="table-row">
          <div class="table-cell label">前</div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'near-close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'close-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell"></div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'open-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'near-open')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('front', 'open')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell label">中</div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'near-close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'close-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'open-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'near-open')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('central', 'open')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell label">后</div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('back', 'close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('back', 'near-close')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('back', 'close-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell"></div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('back', 'open-mid')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
          <div class="table-cell"></div>
          <div class="table-cell">
            <div
              v-for="phoneme in getVowels('back', 'open')"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>
      </div>

      <!-- 双元音 -->
      <div v-if="diphthongs.length > 0" class="diphthong-section">
        <h4>双元音</h4>
        <div class="diphthong-grid">
          <div
            v-for="phoneme in diphthongs"
            :key="phoneme.symbol"
            class="phoneme-cell large"
            :class="{ 'is-english': phoneme.isEnglish }"
            @click="selectPhoneme(phoneme)"
          >
            {{ phoneme.symbol }}
          </div>
        </div>
      </div>
    </div>

    <!-- 辅音图表 -->
    <div v-if="chartType === 'all' || chartType === 'consonants'" class="chart-section">
      <h3>辅音 (Consonants)</h3>

      <div class="consonant-grid">
        <!-- 爆破音 -->
        <div class="consonant-group">
          <h4>爆破音</h4>
          <div class="phoneme-row">
            <div
              v-for="phoneme in consonantCategories.plosives"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <!-- 摩擦音 -->
        <div class="consonant-group">
          <h4>摩擦音</h4>
          <div class="phoneme-row">
            <div
              v-for="phoneme in consonantCategories.fricatives"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <!-- 破擦音 -->
        <div class="consonant-group">
          <h4>破擦音</h4>
          <div class="phoneme-row">
            <div
              v-for="phoneme in consonantCategories.affricates"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <!-- 鼻音 -->
        <div class="consonant-group">
          <h4>鼻音</h4>
          <div class="phoneme-row">
            <div
              v-for="phoneme in consonantCategories.nasals"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>

        <!-- 近音 -->
        <div class="consonant-group">
          <h4>近音</h4>
          <div class="phoneme-row">
            <div
              v-for="phoneme in consonantCategories.approximants"
              :key="phoneme.symbol"
              class="phoneme-cell"
              :class="{ 'is-english': phoneme.isEnglish }"
              @click="selectPhoneme(phoneme)"
            >
              {{ phoneme.symbol }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选中音标详情 -->
    <div v-if="selectedPhoneme" class="selected-detail">
      <AudioPlayer :phoneme="selectedPhoneme" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElRadioGroup, ElRadioButton } from 'element-plus';
import { usePhonemeStore } from '@/stores/phonemes';
import AudioPlayer from './AudioPlayer.vue';

const store = usePhonemeStore();
const chartType = ref('all');
const selectedPhoneme = ref(null);

const vowels = computed(() => store.phonemes.filter(p => p.type === 'vowel'));
const diphthongs = computed(() => vowels.value.filter(v => v.category === 'diphthong'));

const consonantCategories = computed(() => {
  const consonants = store.phonemes.filter(p => p.type === 'consonant');
  return {
    plosives: consonants.filter(p => p.category === 'plosive'),
    fricatives: consonants.filter(p => p.category === 'fricative'),
    affricates: consonants.filter(p => p.category === 'affricate'),
    nasals: consonants.filter(p => p.category === 'nasal'),
    approximants: consonants.filter(p => p.category === 'approximant')
  };
});

const getVowels = (position, category) => {
  return vowels.value.filter(v => {
    const posMatch = v.position === position || v.position === `near-${position}`;
    const catMatch = v.category === category || v.category === `near-${category}`;
    return posMatch && catMatch && v.category !== 'diphthong';
  });
};

const selectPhoneme = (phoneme) => {
  selectedPhoneme.value = phoneme;
  store.setPhoneme(phoneme);
};
</script>

<style scoped>
.ipa-chart {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.chart-section {
  margin-bottom: 32px;
}

.chart-section h3 {
  color: #667eea;
  margin-bottom: 16px;
  font-size: 18px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.chart-section h4 {
  color: #555;
  margin: 12px 0;
  font-size: 14px;
}

/* 元音表格 */
.vowel-table {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid #e9ecef;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.header {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table-cell {
  padding: 12px;
  text-align: center;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell.label {
  background: #f8f9fa;
  font-weight: 500;
  color: #495057;
}

/* 音标单元格 */
.phoneme-cell {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Georgia', serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  color: #333;
}

.phoneme-cell:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.phoneme-cell.is-english {
  background: #e7f5ff;
  border: 2px solid #409EFF;
}

.phoneme-cell.is-english:hover {
  background: #667eea;
  border-color: #667eea;
}

.phoneme-cell.large {
  font-size: 20px;
  padding: 12px 16px;
}

/* 双元音区域 */
.diphthong-section {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.diphthong-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 辅音区域 */
.consonant-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.consonant-group {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.phoneme-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 选中详情 */
.selected-detail {
  margin-top: 24px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ipa-chart {
    padding: 16px;
  }

  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-row {
    grid-template-columns: 60px repeat(7, 1fr);
  }

  .table-cell {
    padding: 8px 4px;
  }

  .phoneme-cell {
    font-size: 14px;
    padding: 6px 8px;
    min-width: 32px;
  }

  .phoneme-cell.large {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .table-row {
    grid-template-columns: 50px repeat(7, 1fr);
  }

  .table-cell {
    padding: 6px 2px;
  }

  .phoneme-cell {
    font-size: 12px;
    padding: 4px 6px;
  }
}
</style>

<template>
  <div
    class="phoneme-card"
    :class="{
      'is-playing': isPlaying,
      'is-looping': isLooping,
      'is-vowel': phoneme.type === 'vowel',
      'is-consonant': phoneme.type === 'consonant'
    }"
    @click="handleCardClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 顶部操作栏 -->
    <div class="card-header">
      <span class="category-badge" :class="phoneme.category">
        {{ categoryLabel }}
      </span>
      <div class="header-actions">
        <button
          class="action-btn loop-btn"
          :class="{ active: isLooping }"
          @click.stop="handleLoop"
          :title="loopButtonTitle"
          aria-label="循环播放"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
        </button>
        <button
          class="action-btn favorite-btn"
          :class="{ active: isFavorite }"
          @click.stop="handleFavorite"
          :title="isFavorite ? '取消收藏' : '收藏'"
          :aria-label="isFavorite ? '取消收藏' : '收藏'"
        >
          <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="card-body">
      <div class="symbol-section">
        <span class="phoneme-symbol">{{ phoneme.symbol }}</span>
        <!-- 加载指示器 -->
        <div class="loading-indicator" v-if="isLoading">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <!-- 播放指示器 -->
        <div class="playing-indicator" v-if="isPlaying || isLooping">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="name-section">
        <span class="chinese-name">{{ phoneme.chineseName }}</span>
        <span class="english-name">{{ phoneme.englishName }}</span>
      </div>

      <div class="description-section" v-if="phoneme.description">
        <p class="description-text">{{ phoneme.description }}</p>
      </div>
    </div>

    <!-- 示例词区域 -->
    <div class="card-footer">
      <div class="examples-list">
        <button
          v-for="(example, index) in phoneme.examples"
          :key="index"
          class="example-chip"
          @click.stop="speakWord(example)"
          :title="`点击朗读: ${example}`"
        >
          {{ example }}
        </button>
      </div>
    </div>

    <!-- 点击波纹效果 -->
    <div class="ripple" v-if="showRipple" :style="rippleStyle"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * 音标卡片组件
 * 文件用途：展示单个音标信息，支持播放、循环、收藏功能
 * 创建日期：2026-02-17
 * 输入：phoneme - 音标数据对象
 * 输出：渲染的音标卡片UI
 * 依赖：Vue 3, Pinia store
 */

import { computed, ref, onUnmounted, onMounted, watch } from 'vue';
import { usePhonemeStore } from '@/stores/phonemes';
import type { Phoneme } from '@/stores/phonemes';
import { getCategoryLabel } from '@/data/ipa-data';
import { logger, logUserAction, logComponentMount, logComponentUnmount, createPerformanceTracker } from '@/utils/logger';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  phoneme: Phoneme
}>();

const cardId = `${props.phoneme.symbol}-${Date.now().toString(36)}`
if (import.meta.env.DEV) {
  console.log(`%c━━━━━━━━━━━━━━━━ PhonemeCard 创建 ━━━━━━━━━━━━━━━━`, 'color: #8b5cf6;')
  console.log(`%c🎴 PhonemeCard.vue 初始化`, 'color: #8b5cf6; font-weight: bold;')
  console.log(`%c   符号: ${props.phoneme.symbol}`, 'color: #64748b;')
  console.log(`%c   中文名: ${props.phoneme.chineseName}`, 'color: #64748b;')
  console.log(`%c   类型: ${props.phoneme.type}`, 'color: #64748b;')
  console.log(`%c   分类: ${props.phoneme.category}`, 'color: #64748b;')
  console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
}

const store = usePhonemeStore();

const isPlaying = computed(() => store.isCurrentPlaying(props.phoneme.symbol));
const isLooping = computed(() => store.isCurrentLooping(props.phoneme.symbol));
const isFavorite = computed(() => store.isFavorite(props.phoneme.symbol));
const isLoading = ref(false);

watch(isPlaying, (newVal, oldVal) => {
  if (import.meta.env.DEV) {
    console.log(`%c━━━━━━━━━━━━━━━━ ${props.phoneme.symbol} 播放状态 ━━━━━━━━━━━━━━━━`, 'color: #3b82f6;')
    console.log(`%c🔊 ${props.phoneme.symbol} 播放状态：${oldVal ? '播放中' : '已停止'} → ${newVal ? '播放中' : '已停止'}`, 'color: #3b82f6;')
    console.log(`%c   卡片 ID: ${cardId}`, 'color: #64748b;')
  }
  // 当开始播放时，停止 loading 状态
  if (newVal) {
    isLoading.value = false;
  }
})

watch(isLooping, (newVal, oldVal) => {
  if (import.meta.env.DEV) {
    console.log(`%c━━━━━━━━━━━━━━━━ ${props.phoneme.symbol} 循环状态 ━━━━━━━━━━━━━━━━`, 'color: #10b981;')
    console.log(`%c🔄 ${props.phoneme.symbol} 循环状态: ${oldVal ? '循环中' : '非循环'} → ${newVal ? '循环中' : '非循环'}`, 'color: #10b981;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
  }
})

watch(isFavorite, (newVal, oldVal) => {
  if (import.meta.env.DEV) {
    console.log(`%c━━━━━━━━━━━━━━━━ ${props.phoneme.symbol} 收藏状态 ━━━━━━━━━━━━━━━━`, 'color: #f59e0b;')
    console.log(`%c⭐ ${props.phoneme.symbol} 收藏状态: ${oldVal ? '已收藏' : '未收藏'} → ${newVal ? '已收藏' : '未收藏'}`, 'color: #f59e0b;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
  }
})

const categoryLabel = computed(() => getCategoryLabel(props.phoneme.category));

const loopButtonTitle = computed(() => {
  if (isLooping.value) return '停止循环播放';
  if (isPlaying.value) return '切换为循环播放';
  return '开始循环播放';
});

const showRipple = ref(false);
const rippleStyle = ref({});
const isTouching = ref(false);

const handleTouchStart = () => {
  isTouching.value = true;
  if (import.meta.env.DEV) {
    console.log(`%c━━━━━━━━━━━━━━━━ ${props.phoneme.symbol} 触摸事件 ━━━━━━━━━━━━━━━━`, 'color: #64748b;')
    console.log(`%c👆 触摸开始: ${props.phoneme.symbol}`, 'color: #64748b;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
  }
  if (navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
    navigator.vibrate(10);
    if (import.meta.env.DEV) {
      console.log(`%c📳 触觉反馈已触发 (10ms)`, 'color: #64748b;')
    }
  }
};

const handleTouchEnd = () => {
  isTouching.value = false;
  if (import.meta.env.DEV) {
    console.log(`%c👆 触摸结束: ${props.phoneme.symbol}`, 'color: #64748b;')
  }
};

const handleCardClick = (event: MouseEvent | TouchEvent) => {
  const tracker = createPerformanceTracker(`卡片点击-${props.phoneme.symbol}`)
  tracker.start()
  
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 卡片点击 ━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;')
  }
  logUserAction('卡片点击', {
    symbol: props.phoneme.symbol,
    chineseName: props.phoneme.chineseName,
    type: props.phoneme.type,
    cardId: cardId
  })
  
  if (import.meta.env.DEV) {
    console.log(`%c🖱️ 卡片点击: ${props.phoneme.symbol}`, 'color: #3b82f6; font-weight: bold;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
    console.log(`%c   事件类型: ${event.type}`, 'color: #64748b;')
    console.log(`%c   当前播放状态: isPlaying=${isPlaying.value}`, 'color: #64748b;')
    console.log(`%c   当前循环状态: isLooping=${isLooping.value}`, 'color: #64748b;')
  }
  
  const card = event.currentTarget as HTMLElement;
  const rect = card.getBoundingClientRect();
  
  let clientX: number, clientY: number;
  
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (touch) {
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = 0;
      clientY = 0;
    }
    if (import.meta.env.DEV) {
      console.log(`%c   触摸坐标: (${clientX}, ${clientY})`, 'color: #64748b;')
    }
  } else {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
    if (import.meta.env.DEV) {
      console.log(`%c   鼠标坐标: (${clientX}, ${clientY})`, 'color: #64748b;')
    }
  }
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  if (import.meta.env.DEV) {
    console.log(`%c   卡片内坐标: (${x.toFixed(0)}, ${y.toFixed(0)})`, 'color: #64748b;')
    console.log(`%c   卡片尺寸: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`, 'color: #64748b;')
  }

  tracker.checkpoint('波纹效果')
  
  rippleStyle.value = {
    left: `${x}px`,
    top: `${y}px`
  };
  showRipple.value = true;
  setTimeout(() => {
    showRipple.value = false;
  }, 600);

  tracker.checkpoint('播放控制')
  
  if (isPlaying.value || isLooping.value) {
    logger.info(`停止播放: ${props.phoneme.symbol}`)
    store.stopPlaying();
  } else {
    logger.info(`开始播放: ${props.phoneme.symbol}`)
    if (import.meta.env.DEV) {
      console.log(`%c   音频文件: ${props.phoneme.audioFile}`, 'color: #64748b;')
    }
    store.playPhoneme(props.phoneme, false);
  }
  
  tracker.end()
};

const handleLoop = () => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 循环按钮点击 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
  }
  logUserAction('循环按钮点击', {
    symbol: props.phoneme.symbol,
    currentLoopState: isLooping.value ? '循环中' : '非循环',
    currentPlayState: isPlaying.value ? '播放中' : '已停止',
    cardId: cardId
  })
  
  if (import.meta.env.DEV) {
    console.log(`%c🔄 循环按钮点击: ${props.phoneme.symbol}`, 'color: #10b981; font-weight: bold;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
    console.log(`%c   当前循环状态: ${isLooping.value ? '循环中' : '非循环'}`, 'color: #64748b;')
    console.log(`%c   当前播放状态: ${isPlaying.value ? '播放中' : '已停止'}`, 'color: #64748b;')
  }
  
  if (isLooping.value) {
    logger.info(`停止循环播放: ${props.phoneme.symbol}`)
  } else {
    logger.info(`开始循环播放: ${props.phoneme.symbol}`)
  }
  
  store.toggleLoop(props.phoneme);
};

const handleFavorite = () => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 收藏按钮点击 ━━━━━━━━━━━━━━━━', 'color: #f59e0b; font-weight: bold;')
  }
  logUserAction('收藏按钮点击', {
    symbol: props.phoneme.symbol,
    chineseName: props.phoneme.chineseName,
    currentFavoriteState: isFavorite.value ? '已收藏' : '未收藏',
    cardId: cardId
  })

  if (import.meta.env.DEV) {
    console.log(`%c⭐ 收藏按钮点击: ${props.phoneme.symbol}`, 'color: #f59e0b; font-weight: bold;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
    console.log(`%c   当前收藏状态: ${isFavorite.value ? '已收藏' : '未收藏'}`, 'color: #64748b;')
  }

  const wasFavorite = isFavorite.value;

  if (wasFavorite) {
    logger.info(`取消收藏: ${props.phoneme.symbol}`)
  } else {
    logger.success(`添加收藏: ${props.phoneme.symbol}`)
  }

  store.toggleFavorite(props.phoneme.symbol);

  // 显示收藏/取消收藏提示
  ElMessage({
    message: wasFavorite ? `已取消收藏 ${props.phoneme.symbol}` : `已收藏 ${props.phoneme.symbol}`,
    type: wasFavorite ? 'info' : 'success',
    duration: 2000,
    offset: 20
  });

  if (navigator.vibrate && window.matchMedia('(pointer: coarse)').matches) {
    navigator.vibrate(20);
    logger.debug('触觉反馈已触发 (20ms)')
  }
};

const wordAudio = ref<HTMLAudioElement | null>(null);

const speakWord = (word: string) => {
  if (import.meta.env.DEV) {
    console.log('%c━━━━━━━━━━━━━━━━ 单词朗读 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  }
  logUserAction('单词朗读', {
    word: word,
    symbol: props.phoneme.symbol,
    cardId: cardId
  })
  
  logger.info(`朗读单词: ${word}`)
  if (import.meta.env.DEV) {
    console.log(`%c   所属音标: ${props.phoneme.symbol}`, 'color: #64748b;')
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
  }
  
  if (wordAudio.value) {
    logger.debug('停止之前的单词音频')
    wordAudio.value.pause();
    wordAudio.value.currentTime = 0;
    wordAudio.value = null;
  }

  const audioPath = `/word-audio/${word}.mp3`;
  if (import.meta.env.DEV) {
    console.log(`%c   音频路径: ${audioPath}`, 'color: #64748b;')
  }
  
  const audioLoadStart = performance.now()
  const audio = new Audio(audioPath);
  wordAudio.value = audio;

  audio.onloadeddata = () => {
    const loadTime = performance.now() - audioLoadStart
    logger.performance(`单词音频加载完成: ${word} (${loadTime.toFixed(2)}ms)`)
    if (import.meta.env.DEV) {
      console.log(`%c   音频时长: ${audio.duration.toFixed(2)}s`, 'color: #64748b;')
    }
  }

  audio.onerror = () => {
    logger.error(`单词音频加载失败: ${word}`)
    if (import.meta.env.DEV) {
      console.error(`%c   音频路径: ${audioPath}`, 'color: #64748b;')
      console.error(`%c   错误代码: ${audio.error?.code}`, 'color: #64748b;')
      console.error(`%c   错误消息: ${audio.error?.message}`, 'color: #64748b;')
    }
    wordAudio.value = null;
  };

  audio.onended = () => {
    logger.success(`单词朗读完成: ${word}`)
    wordAudio.value = null;
  };

  audio.onwaiting = () => {
    logger.warning(`单词音频缓冲中: ${word}`)
  }

  audio.onstalled = () => {
    logger.warning(`单词音频加载停滞: ${word}`)
  }

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      logger.error(`单词音频播放失败: ${word}`)
      if (import.meta.env.DEV) {
        console.error(`%c   错误信息: ${err.message}`, 'color: #64748b;')
      }
      wordAudio.value = null;
    });
  }
};

onMounted(() => {
  logComponentMount(`PhonemeCard: ${props.phoneme.symbol}`)
  if (import.meta.env.DEV) {
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
    console.log(`%c   符号: ${props.phoneme.symbol}`, 'color: #64748b;')
    console.log(`%c   类型: ${props.phoneme.type}`, 'color: #64748b;')
    console.log(`%c   分类: ${props.phoneme.category}`, 'color: #64748b;')
  }
})

/**
 * 清理音频资源
 * 实现说明：
 *   - 暂停音频播放
 *   - 移除所有事件监听器避免内存泄漏
 *   - 清空音频src释放资源
 *   - 触发load()强制释放资源
 *   - 清空引用
 */
const cleanupWordAudio = () => {
  if (wordAudio.value) {
    logger.debug('清理单词音频资源')
    wordAudio.value.pause();
    wordAudio.value.src = '';
    wordAudio.value.load();
    wordAudio.value.onloadeddata = null;
    wordAudio.value.onerror = null;
    wordAudio.value.onended = null;
    wordAudio.value.onwaiting = null;
    wordAudio.value.onstalled = null;
    wordAudio.value = null;
  }
};

onUnmounted(() => {
  logComponentUnmount(`PhonemeCard: ${props.phoneme.symbol}`)
  if (import.meta.env.DEV) {
    console.log(`%c   卡片ID: ${cardId}`, 'color: #64748b;')
  }
  cleanupWordAudio();
});
</script>

<style scoped>
/* ============================================
   文件用途: 音标卡片组件 - 展示单个音标信息
   创建日期: 2026-02-17
   输入: phoneme - 音标数据对象
   输出: 渲染的音标卡片UI
   依赖: Vue 3, Pinia store
   ============================================ */

.phoneme-card {
  /* CSS Variables - 卡片主题色 */
  --card-bg: #ffffff;
  --card-bg-hover: #f8fafc;
  --card-bg-active: #f1f5f9;
  --card-border: #e2e8f0;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.12);
  --card-shadow-active: 0 2px 6px rgba(0, 0, 0, 0.1);
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  /* 布局 */
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* 防止文字被选中 */
  user-select: none;
  -webkit-user-select: none;
  
  /* 移动端优化：增大触摸区域 */
  min-height: 180px;
}

/* 深色模式变量 */
[data-theme="dark"] .phoneme-card {
  --card-bg: #1e293b;
  --card-bg-hover: #252f47;
  --card-bg-active: #1a2332;
  --card-border: #334155;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.4);
  --card-shadow-active: 0 2px 6px rgba(0, 0, 0, 0.35);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}

/* 悬停效果 - 桌面端 */
@media (hover: hover) {
  .phoneme-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow-hover);
    border-color: #cbd5e1;
  }
  
  [data-theme="dark"] .phoneme-card:hover {
    border-color: #475569;
  }
}

/* 移动端触摸反馈 */
.phoneme-card:active {
  transform: scale(0.98);
  box-shadow: var(--card-shadow-active);
  background: var(--card-bg-active);
}

/* 播放状态 */
.phoneme-card.is-playing {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), var(--card-shadow-hover);
}

.phoneme-card.is-playing .phoneme-symbol {
  color: #3b82f6;
}

/* 循环播放状态 */
.phoneme-card.is-looping {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15), var(--card-shadow-hover);
}

.phoneme-card.is-looping .phoneme-symbol {
  color: #10b981;
}

/* ============================================
   卡片头部 - 分类标签和操作按钮
   ============================================ */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 0;
}

.category-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* 分类标签颜色 */
.category-badge.monophthong {
  background: #dcfce7;
  color: #166534;
}

.category-badge.diphthong {
  background: #fef3c7;
  color: #92400e;
}

.category-badge.plosive {
  background: #dbeafe;
  color: #1e40af;
}

.category-badge.fricative {
  background: #fce7f3;
  color: #9d174d;
}

.category-badge.affricate {
  background: #e0e7ff;
  color: #3730a3;
}

.category-badge.nasal {
  background: #f3e8ff;
  color: #6b21a8;
}

.category-badge.approximant {
  background: #ccfbf1;
  color: #0f766e;
}

/* 深色模式分类标签 */
[data-theme="dark"] .category-badge.monophthong {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

[data-theme="dark"] .category-badge.diphthong {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

[data-theme="dark"] .category-badge.plosive {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

[data-theme="dark"] .category-badge.fricative {
  background: rgba(236, 72, 153, 0.2);
  color: #f9a8d4;
}

[data-theme="dark"] .category-badge.affricate {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

[data-theme="dark"] .category-badge.nasal {
  background: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
}

[data-theme="dark"] .category-badge.approximant {
  background: rgba(20, 184, 166, 0.2);
  color: #5eead4;
}

/* 头部操作按钮 */
.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  
  /* 移动端增大触摸目标 */
  min-width: 32px;
  min-height: 32px;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: #f1f5f9;
  color: var(--text-secondary);
}

.action-btn:active {
  transform: scale(0.92);
}

[data-theme="dark"] .action-btn:hover {
  background: #334155;
}

.action-btn.loop-btn.active {
  background: #10b981;
  color: white;
}

.action-btn.favorite-btn.active {
  background: #f59e0b;
  color: white;
}

/* ============================================
   卡片主体 - 音标符号和名称
   ============================================ */
.card-body {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.symbol-section {
  position: relative;
  margin-bottom: 12px;
}

.phoneme-symbol {
  font-family: 'Times New Roman', 'Georgia', 'Noto Serif', serif;
  font-size: 44px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 16px;
}

.loading-indicator span {
  width: 3px;
  background: #f59e0b;
  border-radius: 2px;
  animation: loadingWave 0.8s ease-in-out infinite;
}

.loading-indicator span:nth-child(1) {
  height: 6px;
  animation-delay: 0s;
}

.loading-indicator span:nth-child(2) {
  height: 12px;
  animation-delay: 0.2s;
}

.loading-indicator span:nth-child(3) {
  height: 8px;
  animation-delay: 0.4s;
}

@keyframes loadingWave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
}

/* 元音和辅音的默认颜色 */
.is-vowel .phoneme-symbol {
  color: #059669;
}

.is-consonant .phoneme-symbol {
  color: #2563eb;
}

[data-theme="dark"] .is-vowel .phoneme-symbol {
  color: #34d399;
}

[data-theme="dark"] .is-consonant .phoneme-symbol {
  color: #60a5fa;
}

/* 播放指示器 */
.playing-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 16px;
}

.playing-indicator span {
  width: 3px;
  background: currentColor;
  border-radius: 2px;
  animation: soundWave 0.8s ease-in-out infinite;
}

.is-playing .playing-indicator span {
  background: #3b82f6;
}

.is-looping .playing-indicator span {
  background: #10b981;
}

.playing-indicator span:nth-child(1) {
  height: 6px;
  animation-delay: 0s;
}

.playing-indicator span:nth-child(2) {
  height: 12px;
  animation-delay: 0.2s;
}

.playing-indicator span:nth-child(3) {
  height: 8px;
  animation-delay: 0.4s;
}

@keyframes soundWave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
}

/* 名称区域 */
.name-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.chinese-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.english-name {
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
}

/* 描述区域 */
.description-section {
  width: 100%;
}

.description-text {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ============================================
   卡片底部 - 示例词
   ============================================ */
.card-footer {
  padding: 0 12px 12px;
  border-top: 1px solid var(--card-border);
  margin-top: auto;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 12px;
  justify-content: center;
}

.example-chip {
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  background: #f1f5f9;
  border: none;
  border-radius: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  
  /* 移动端优化触摸目标 */
  min-height: 28px;
}

.example-chip:hover {
  background: #e2e8f0;
  color: var(--text-primary);
}

.example-chip:active {
  transform: scale(0.95);
  background: #cbd5e1;
}

[data-theme="dark"] .example-chip {
  background: #334155;
  color: #94a3b8;
}

[data-theme="dark"] .example-chip:hover {
  background: #475569;
  color: #e2e8f0;
}

[data-theme="dark"] .example-chip:active {
  background: #52525b;
}

/* ============================================
   波纹效果
   ============================================ */
.ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(59, 130, 246, 0.25);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: rippleEffect 0.5s ease-out;
  pointer-events: none;
}

@keyframes rippleEffect {
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

/* ============================================
   响应式设计 - 移动端优化
   ============================================ */
@media (max-width: 640px) {
  .phoneme-card {
    border-radius: 10px;
    min-height: auto;
  }

  .card-header {
    padding: 8px 8px 0;
  }

  .category-badge {
    font-size: 9px;
    padding: 2px 6px;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
  }

  .action-btn svg {
    width: 14px;
    height: 14px;
  }

  .card-body {
    padding: 8px 6px;
  }

  .symbol-section {
    margin-bottom: 6px;
  }

  .phoneme-symbol {
    font-size: 32px;
    line-height: 1.2;
  }

  .name-section {
    margin-bottom: 6px;
    gap: 2px;
  }

  .chinese-name {
    font-size: 12px;
  }

  .english-name {
    font-size: 9px;
  }

  .description-section {
    display: none;
  }

  .card-footer {
    padding: 0 6px 8px;
    border-top: none;
  }

  .examples-list {
    padding-top: 0;
    gap: 4px;
  }

  .example-chip {
    font-size: 10px;
    padding: 3px 6px;
    min-height: 22px;
    border-radius: 10px;
  }

  .playing-indicator {
    height: 12px;
    bottom: -4px;
  }

  .playing-indicator span {
    width: 2px;
  }

  .playing-indicator span:nth-child(1) {
    height: 4px;
  }

  .playing-indicator span:nth-child(2) {
    height: 8px;
  }

  .playing-indicator span:nth-child(3) {
    height: 6px;
  }

  /* 减小波纹效果 */
  .ripple {
    width: 60px;
    height: 60px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .phoneme-card {
    min-height: auto;
  }

  .card-header {
    padding: 6px 6px 0;
  }

  .category-badge {
    font-size: 8px;
    padding: 2px 5px;
  }

  .action-btn {
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
  }

  .action-btn svg {
    width: 12px;
    height: 12px;
  }

  .card-body {
    padding: 6px 4px;
  }

  .phoneme-symbol {
    font-size: 28px;
  }

  .chinese-name {
    font-size: 11px;
  }

  .english-name {
    font-size: 8px;
  }

  .card-footer {
    padding: 0 4px 6px;
  }

  .example-chip {
    font-size: 9px;
    padding: 2px 5px;
    min-height: 20px;
  }
}

/* 平板设备优化 */
@media (min-width: 641px) and (max-width: 1024px) {
  .phoneme-symbol {
    font-size: 40px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .phoneme-card {
    transition: none;
  }
  
  .playing-indicator span {
    animation: none;
  }
  
  .ripple {
    display: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .phoneme-card {
    border-width: 2px;
  }
  
  .category-badge {
    border: 1px solid currentColor;
  }
}
</style>

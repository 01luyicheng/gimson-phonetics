/**
 * 音标状态管理Store
 * 文件用途：管理音标播放、收藏、学习进度等状态
 * 创建日期：2026-02-16
 * 输入输出签名：Pinia Store
 * 依赖列表：pinia@2.x, vue@3.x
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ipaPhonemes, getAudioPath, searchPhonemes, vowels, consonants } from '@/data/ipa-data';

export const usePhonemeStore = defineStore('phonemes', () => {
  const phonemes = ref(ipaPhonemes);
  const favorites = ref([]);
  const progress = ref([]);
  const currentPhoneme = ref(null);
  const currentAudio = ref(null);
  const isPlaying = ref(false);
  const isLooping = ref(false);
  const loopPhonemeSymbol = ref(null);
  const searchQuery = ref('');
  const playAllMode = ref(false);
  const playAllIndex = ref(0);

  const initializeStore = () => {
    const savedFavorites = localStorage.getItem('ipa-favorites');
    const savedProgress = localStorage.getItem('ipa-progress');
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites);
    }
    if (savedProgress) {
      progress.value = JSON.parse(savedProgress);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('ipa-favorites', JSON.stringify(favorites.value));
    localStorage.setItem('ipa-progress', JSON.stringify(progress.value));
  };

  const filteredPhonemes = computed(() => {
    if (!searchQuery.value) return phonemes.value;
    return searchPhonemes(searchQuery.value);
  });

  const favoritePhonemes = computed(() => {
    return phonemes.value.filter(p => favorites.value.includes(p.symbol));
  });

  const progressPercentage = computed(() => {
    if (phonemes.value.length === 0) return 0;
    return Math.round((progress.value.length / phonemes.value.length) * 100);
  });

  /**
   * 停止当前音频播放（仅停止音频对象）
   * 用于内部清理，不重置状态变量
   */
  const cleanupAudio = () => {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value.currentTime = 0;
      currentAudio.value.onended = null;
      currentAudio.value.onerror = null;
      currentAudio.value = null;
    }
  };

  /**
   * 停止当前音频播放并重置基础播放状态
   * 用于单个音标播放的场景
   */
  const stopCurrentAudio = () => {
    cleanupAudio();
    isPlaying.value = false;
    isLooping.value = false;
    loopPhonemeSymbol.value = null;
    currentPhoneme.value = null;
  };

  /**
   * 统一停止所有播放
   * 重置所有播放相关状态，包括播放全部模式
   */
  const stopAllPlayback = () => {
    cleanupAudio();
    isPlaying.value = false;
    isLooping.value = false;
    loopPhonemeSymbol.value = null;
    playAllMode.value = false;
    playAllIndex.value = 0;
    currentPhoneme.value = null;
  };

  /**
   * 播放单个音标
   * @param {Object} phoneme - 音标对象
   * @param {boolean} loop - 是否循环播放
   * @returns {HTMLAudioElement} 音频对象
   */
  const playPhoneme = (phoneme, loop = false) => {
    // 如果正在播放全部模式，先完全停止
    if (playAllMode.value) {
      stopAllPlayback();
    } else {
      // 否则只停止当前音频
      stopCurrentAudio();
    }
    
    currentPhoneme.value = phoneme;
    isPlaying.value = true;
    
    if (loop) {
      isLooping.value = true;
      loopPhonemeSymbol.value = phoneme.symbol;
    }

    // 记录学习进度
    if (!progress.value.includes(phoneme.symbol)) {
      progress.value.push(phoneme.symbol);
      saveToLocalStorage();
    }

    const audio = new Audio(getAudioPath(phoneme.audioFile));
    currentAudio.value = audio;
    audio.loop = loop;

    audio.onended = () => {
      if (!loop) {
        isPlaying.value = false;
        currentPhoneme.value = null;
        currentAudio.value = null;
      }
    };

    audio.onerror = () => {
      console.error(`音频加载失败: ${phoneme.audioFile}`);
      stopCurrentAudio();
    };

    audio.play().catch(err => {
      console.error('音频播放失败:', err);
      stopCurrentAudio();
    });

    return audio;
  };

  /**
   * 停止播放（用户主动停止）
   * 调用统一停止函数重置所有状态
   */
  const stopPlaying = () => {
    stopAllPlayback();
  };

  /**
   * 切换循环播放
   * @param {Object} phoneme - 要循环播放的音标对象
   */
  const toggleLoop = (phoneme) => {
    // 如果正在播放全部模式，先停止播放全部
    if (playAllMode.value) {
      stopAllPlayback();
    }
    
    if (loopPhonemeSymbol.value === phoneme.symbol && isLooping.value) {
      // 当前音标正在循环，停止循环
      stopCurrentAudio();
    } else {
      // 播放新的循环音标
      playPhoneme(phoneme, true);
    }
  };

  const toggleFavorite = (symbol) => {
    const index = favorites.value.indexOf(symbol);
    if (index > -1) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push(symbol);
    }
    saveToLocalStorage();
  };

  const isFavorite = (symbol) => {
    return favorites.value.includes(symbol);
  };

  const isCurrentPlaying = (symbol) => {
    return isPlaying.value && currentPhoneme.value?.symbol === symbol;
  };

  const isCurrentLooping = (symbol) => {
    return loopPhonemeSymbol.value === symbol;
  };

  /**
   * 播放全部音标
   * 按顺序播放所有音标，每个音标之间有500ms间隔
   * 可被中断停止
   */
  const playAllPhonemes = async () => {
    // 如果已经在播放全部模式，则停止
    if (playAllMode.value) {
      stopAllPlayback();
      return;
    }
    
    // 先停止任何正在进行的播放
    stopAllPlayback();
    
    playAllMode.value = true;
    playAllIndex.value = 0;
    
    const allPhonemes = [...vowels, ...consonants];
    const PLAY_INTERVAL = 500; // 播放间隔500ms
    
    const playNext = () => {
      // 检查是否应该停止播放
      if (!playAllMode.value || playAllIndex.value >= allPhonemes.length) {
        stopAllPlayback();
        return;
      }
      
      // 先清理之前的音频对象，避免内存泄漏
      cleanupAudio();
      
      const phoneme = allPhonemes[playAllIndex.value];
      const audio = new Audio(getAudioPath(phoneme.audioFile));
      currentAudio.value = audio;
      currentPhoneme.value = phoneme;
      isPlaying.value = true;
      
      // 记录学习进度
      if (!progress.value.includes(phoneme.symbol)) {
        progress.value.push(phoneme.symbol);
        saveToLocalStorage();
      }
      
      audio.onended = () => {
        playAllIndex.value++;
        // 添加播放间隔
        if (playAllMode.value && playAllIndex.value < allPhonemes.length) {
          // 间隔期间清理当前音标状态，避免UI不一致
          currentPhoneme.value = null;
          isPlaying.value = false;
          currentAudio.value = null;
          setTimeout(() => {
            if (playAllMode.value) {
              playNext();
            }
          }, PLAY_INTERVAL);
        } else {
          // 播放完成，重置所有状态
          stopAllPlayback();
        }
      };
      
      audio.onerror = () => {
        console.error(`音频加载失败: ${phoneme.audioFile}`);
        playAllIndex.value++;
        // 继续播放下一个
        setTimeout(() => {
          if (playAllMode.value) {
            playNext();
          }
        }, PLAY_INTERVAL);
      };
      
      audio.play().catch(err => {
        console.error('播放失败:', err);
        playAllIndex.value++;
        // 继续播放下一个
        setTimeout(() => {
          if (playAllMode.value) {
            playNext();
          }
        }, PLAY_INTERVAL);
      });
    };
    
    playNext();
  };

  const clearProgress = () => {
    progress.value = [];
    saveToLocalStorage();
  };

  const clearFavorites = () => {
    favorites.value = [];
    saveToLocalStorage();
  };

  return {
    phonemes,
    favorites,
    progress,
    currentPhoneme,
    currentAudio,
    isPlaying,
    isLooping,
    loopPhonemeSymbol,
    searchQuery,
    playAllMode,
    playAllIndex,
    filteredPhonemes,
    favoritePhonemes,
    progressPercentage,
    initializeStore,
    playPhoneme,
    stopCurrentAudio,
    stopAllPlayback,
    stopPlaying,
    toggleLoop,
    toggleFavorite,
    isFavorite,
    isCurrentPlaying,
    isCurrentLooping,
    playAllPhonemes,
    clearProgress,
    clearFavorites
  };
});

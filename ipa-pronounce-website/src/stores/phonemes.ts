/**
 * 音标状态管理Store
 * 文件用途：管理音标播放、收藏、学习进度等状态
 * 创建日期：2026-02-17
 * 输入输出签名：Pinia Store
 * 依赖列表：pinia@2.x, vue@3.x
 * 实现说明：
 *   - 音频播放已针对微信浏览器优化，支持用户交互后自动播放
 *   - 使用微信JS-SDK风格的音频初始化策略
 *   - 支持播放位置记忆和断点续播
 *   - FIXME: 需要添加初始化状态标记防止重复初始化
 */

if (import.meta.env.DEV) {
  console.log('%c📊 phonemes.ts 模块开始加载', 'color: #8b5cf6; font-weight: bold;')
}

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ipaPhonemes, getAudioPath, searchPhonemes, vowels, consonants } from '@/data/ipa-data';
import { logger, setupAudioLogging } from '@/utils/logger';

/**
 * 音标数据类型定义
 */
export interface Phoneme {
  symbol: string;
  name: string;
  type: 'vowel' | 'consonant';
  category: string;
  subCategory: string;
  position: string;
  rounded: boolean;
  audioFile: string;
  examples: string[];
  description: string;
  englishName: string;
  chineseName: string;
}

/**
 * 音标Store类型定义
 */
export interface PhonemeStore {
  phonemes: Phoneme[];
  favorites: string[];
  progress: string[];
  currentPhoneme: Phoneme | null;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  isLooping: boolean;
  loopPhonemeSymbol: string | null;
  searchQuery: string;
  playAllMode: boolean;
  playAllIndex: number;
  savedPlayAllIndex: number;
  isWechatBrowser: boolean;
}

if (import.meta.env.DEV) {
  console.log(`%c📦 音标数据已加载: ${ipaPhonemes.length} 个音标`, 'color: #10b981;')
}

// 模块级变量，用于管理事件监听器和初始化状态
let beforeUnloadHandler: ((this: Window, ev: BeforeUnloadEvent) => void) | null = null;
let visibilityChangeHandler: (() => void) | null = null;
let isStoreInitialized = false;

export const usePhonemeStore = defineStore('phonemes', () => {
  if (import.meta.env.DEV) {
    console.log('%c🏪 Pinia Store 初始化中...', 'color: #3b82f6; font-weight: bold;')
  }
  const phonemes = ref<Phoneme[]>(ipaPhonemes);
  const favorites = ref<string[]>([]);
  const progress = ref<string[]>([]);
  const currentPhoneme = ref<Phoneme | null>(null);
  const currentAudio = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const isLooping = ref(false);
  const loopPhonemeSymbol = ref<string | null>(null);
  const searchQuery = ref('');
  const playAllMode = ref(false);
  const playAllIndex = ref(0);
  const savedPlayAllIndex = ref(0);
  
  // 微信浏览器音频上下文（用于解决自动播放限制）
  const audioContext = ref<AudioContext | null>(null);
  const isWechatBrowser = ref(false);

  /**
   * 初始化Store
   * 实现说明：
   *   - 使用模块级变量isStoreInitialized防止重复初始化
   *   - 清理旧的事件监听器避免内存泄漏
   *   - 检测微信浏览器并启用兼容模式
   */
  const initializeStore = () => {
    // 防止重复初始化
    if (isStoreInitialized) {
      if (import.meta.env.DEV) {
        console.log('%c📊 Store已初始化，跳过', 'color: #64748b;')
      }
      return;
    }
    
    if (import.meta.env.DEV) {
      console.log('%c📊 正在初始化音标Store...', 'color: #3b82f6;')
    }
    
    // 检测微信浏览器
    const ua = navigator.userAgent.toLowerCase();
    isWechatBrowser.value = /micromessenger/.test(ua);
    if (isWechatBrowser.value) {
      if (import.meta.env.DEV) {
        console.log('%c📱 检测到微信浏览器，启用音频兼容模式', 'color: #07c160;');
      }
    }
    
    const savedFavorites = localStorage.getItem('ipa-favorites');
    const savedProgress = localStorage.getItem('ipa-progress');
    const savedPlayAllIndexStr = localStorage.getItem('ipa-playall-index');
    if (savedFavorites) {
      try {
        favorites.value = JSON.parse(savedFavorites);
        if (import.meta.env.DEV) {
          console.log(`%c⭐ 已加载收藏: ${favorites.value.length} 个`, 'color: #10b981;')
        }
      } catch (e) {
        logger.error('解析收藏数据失败', e);
        favorites.value = [];
      }
    }
    if (savedProgress) {
      try {
        progress.value = JSON.parse(savedProgress);
        if (import.meta.env.DEV) {
          console.log(`%c📈 已加载学习进度: ${progress.value.length} 个音标`, 'color: #10b981;')
        }
      } catch (e) {
        logger.error('解析进度数据失败', e);
        progress.value = [];
      }
    }
    if (savedPlayAllIndexStr !== null) {
      const parsedIndex = parseInt(savedPlayAllIndexStr, 10);
      if (!isNaN(parsedIndex) && parsedIndex >= 0) {
        savedPlayAllIndex.value = parsedIndex;
        if (import.meta.env.DEV) {
          console.log(`%c🎵 已加载播放位置: 第 ${parsedIndex + 1} 个音标`, 'color: #10b981;')
        }
      }
    }
    if (import.meta.env.DEV) {
      console.log(`%c📋 总音标数量: ${phonemes.value.length} (元音: ${vowels.length}, 辅音: ${consonants.length})`, 'color: #10b981;')
    }
    
    // 清理旧的事件监听器，避免内存泄漏
    if (beforeUnloadHandler) {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
    
    // 页面卸载时保存播放位置
    beforeUnloadHandler = () => {
      if (playAllMode.value && playAllIndex.value > 0) {
        try {
          localStorage.setItem('ipa-playall-index', playAllIndex.value.toString());
        } catch (e) {
          // 忽略卸载时的存储错误
        }
      }
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    
    // 微信浏览器：监听页面可见性变化，处理后台切换
    if (isWechatBrowser.value) {
      // 清理旧的监听器
      if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
      }
      
      visibilityChangeHandler = () => {
        if (document.hidden && currentAudio.value) {
          // 页面进入后台时暂停播放
          currentAudio.value.pause();
          isPlaying.value = false;
        }
      };
      document.addEventListener('visibilitychange', visibilityChangeHandler);
    }
    
    // 标记初始化完成
    isStoreInitialized = true;
    
    if (import.meta.env.DEV) {
      console.log('%c✅ Store初始化完成', 'color: #10b981;')
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('ipa-favorites', JSON.stringify(favorites.value));
      localStorage.setItem('ipa-progress', JSON.stringify(progress.value));
      localStorage.setItem('ipa-playall-index', savedPlayAllIndex.value.toString());
    } catch (e) {
      console.error('%c❌ 保存到localStorage失败:', 'color: #ef4444;', e);
    }
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
   * 初始化音频上下文（用于微信浏览器）
   * 微信浏览器需要用户交互后才能播放音频
   */
  const initAudioContext = () => {
    if (isWechatBrowser.value && !audioContext.value) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioContext.value = new AudioContext();
          // 尝试恢复音频上下文（如果处于suspended状态）
          if (audioContext.value.state === 'suspended') {
            audioContext.value.resume();
          }
        }
      } catch (e) {
        console.warn('%c⚠️ 音频上下文初始化失败:', 'color: #f59e0b;', e);
      }
    }
  };

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
      currentAudio.value.onloadeddata = null;
      currentAudio.value.onwaiting = null;
      currentAudio.value.onstalled = null;
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
   * 如果是在播放全部模式下停止，保存当前播放位置
   */
  const stopAllPlayback = () => {
    if (import.meta.env.DEV) {
      console.log('%c⏹️ 停止所有播放', 'color: #f59e0b;')
    }
    if (playAllMode.value && playAllIndex.value > 0) {
      savedPlayAllIndex.value = playAllIndex.value;
      saveToLocalStorage();
      if (import.meta.env.DEV) {
        console.log(`%c💾 已保存播放位置: 第 ${playAllIndex.value + 1} 个音标`, 'color: #10b981;')
      }
    }
    cleanupAudio();
    isPlaying.value = false;
    isLooping.value = false;
    loopPhonemeSymbol.value = null;
    playAllMode.value = false;
    playAllIndex.value = 0;
    currentPhoneme.value = null;
  };

  /**
   * 播放音频（带微信浏览器兼容性处理）
   * @param audio - 音频对象
   * @returns 播放Promise
   */
  const playAudioWithWechatCompat = async (audio: HTMLAudioElement): Promise<boolean> => {
    // 初始化音频上下文（微信浏览器需要）
    initAudioContext();
    
    try {
      // 微信浏览器：先尝试直接播放
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        return true;
      }
      return true;
    } catch (err) {
      console.warn('%c⚠️ 音频播放失败，尝试兼容性方案:', 'color: #f59e0b;', err);
      
      // 微信浏览器特殊处理：尝试静音后播放再恢复音量
      if (isWechatBrowser.value) {
        try {
          const originalVolume = audio.volume;
          audio.volume = 0;
          await audio.play();
          audio.volume = originalVolume;
          return true;
        } catch (e) {
          console.error('%c❌ 微信浏览器音频播放失败:', 'color: #ef4444;', e);
          return false;
        }
      }
      
      return false;
    }
  };

  /**
   * 播放单个音标
   * @param phoneme - 音标对象
   * @param loop - 是否循环播放
   * @returns 音频对象
   */
  const playPhoneme = async (phoneme: Phoneme, loop = false): Promise<HTMLAudioElement | null> => {
    if (import.meta.env.DEV) {
      console.log('%c━━━━━━━━━━━━━━━━ 播放音标 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
    }
    logger.info(`播放音标: ${phoneme.symbol} ${loop ? '(循环播放)' : ''}`)
    if (import.meta.env.DEV) {
      console.log(`%c📊 音标详情:`, 'color: #64748b;')
      console.log(`%c   符号: ${phoneme.symbol}`, 'color: #64748b;')
      console.log(`%c   中文名: ${phoneme.chineseName}`, 'color: #64748b;')
      console.log(`%c   英文名: ${phoneme.englishName}`, 'color: #64748b;')
      console.log(`%c   类型: ${phoneme.type}`, 'color: #64748b;')
      console.log(`%c   分类: ${phoneme.category}`, 'color: #64748b;')
      console.log(`%c   音频文件: ${phoneme.audioFile}`, 'color: #64748b;')
      console.log(`%c   示例词: ${phoneme.examples.join(', ')}`, 'color: #64748b;')
    }
    
    if (playAllMode.value) {
      stopAllPlayback();
    } else {
      stopCurrentAudio();
    }
    
    currentPhoneme.value = phoneme;
    isPlaying.value = true;
    
    if (loop) {
      isLooping.value = true;
      loopPhonemeSymbol.value = phoneme.symbol;
    }

    if (!progress.value.includes(phoneme.symbol)) {
      progress.value.push(phoneme.symbol);
      saveToLocalStorage();
      logger.success(`新学习音标: ${phoneme.symbol}`)
    }

    const audioLoadStart = performance.now()
    const audio = new Audio(getAudioPath(phoneme.audioFile));
    currentAudio.value = audio;
    audio.loop = loop;

    setupAudioLogging(audio, phoneme.symbol)

    audio.onloadeddata = () => {
      const loadTime = performance.now() - audioLoadStart
      logger.performance(`音频加载完成: ${phoneme.symbol} (${loadTime.toFixed(2)}ms)`)
      if (import.meta.env.DEV) {
        console.log(`%c📊 音频时长: ${audio.duration.toFixed(2)}s`, 'color: #64748b;')
        console.log(`%c📊 音频状态: readyState=${audio.readyState}`, 'color: #64748b;')
      }
    }

    audio.onended = () => {
      if (!loop) {
        isPlaying.value = false;
        currentPhoneme.value = null;
        currentAudio.value = null;
        logger.debug(`播放结束: ${phoneme.symbol}`)
      }
    };

    audio.onerror = () => {
      logger.error(`音频加载失败: ${phoneme.audioFile}`)
      if (import.meta.env.DEV) {
        console.error(`%c❌ 错误代码: ${audio.error?.code}`, 'color: #ef4444;')
        console.error(`%c❌ 错误消息: ${audio.error?.message}`, 'color: #ef4444;')
      }
      stopCurrentAudio();
    };

    audio.onwaiting = () => {
      logger.warning(`音频缓冲中: ${phoneme.symbol}`)
    }

    audio.onstalled = () => {
      logger.warning(`音频加载停滞: ${phoneme.symbol}`)
    }

    const playSuccess = await playAudioWithWechatCompat(audio);
    if (!playSuccess) {
      stopCurrentAudio();
    }

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
   * @param phoneme - 要循环播放的音标对象
   */
  const toggleLoop = async (phoneme: Phoneme) => {
    // 如果正在播放全部模式，先停止播放全部
    if (playAllMode.value) {
      stopAllPlayback();
    }
    
    if (loopPhonemeSymbol.value === phoneme.symbol && isLooping.value) {
      // 当前音标正在循环，停止循环
      stopCurrentAudio();
    } else {
      // 播放新的循环音标
      await playPhoneme(phoneme, true);
    }
  };

  const toggleFavorite = (symbol: string) => {
    const index = favorites.value.indexOf(symbol);
    if (index > -1) {
      favorites.value.splice(index, 1);
      if (import.meta.env.DEV) {
        console.log(`%c💔 取消收藏: ${symbol}`, 'color: #ef4444;')
      }
    } else {
      favorites.value.push(symbol);
      if (import.meta.env.DEV) {
        console.log(`%c❤️ 添加收藏: ${symbol}`, 'color: #f43f5e;')
      }
    }
    saveToLocalStorage();
  };

  const isFavorite = (symbol: string) => {
    return favorites.value.includes(symbol);
  };

  const isCurrentPlaying = (symbol: string) => {
    return isPlaying.value && currentPhoneme.value?.symbol === symbol;
  };

  const isCurrentLooping = (symbol: string) => {
    return loopPhonemeSymbol.value === symbol;
  };

  /**
   * 播放全部音标
   * 按顺序播放所有音标，每个音标之间有200ms间隔
   * 可被中断停止，停止后下次从上次位置继续播放
   * 已针对微信浏览器优化
   */
  const playAllPhonemes = async () => {
    if (import.meta.env.DEV) {
      console.log('%c━━━━━━━━━━━━━━━━ 播放全部音标 ━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;')
    }
    logger.info('播放全部音标模式')
    
    if (playAllMode.value) {
      logger.warning('停止播放全部模式')
      stopAllPlayback();
      return;
    }
    
    initAudioContext();
    
    cleanupAudio();
    isPlaying.value = false;
    isLooping.value = false;
    loopPhonemeSymbol.value = null;
    playAllMode.value = false;
    currentPhoneme.value = null;
    
    const allPhonemes = [...vowels, ...consonants];
    if (import.meta.env.DEV) {
      console.log(`%c📊 总音标数量: ${allPhonemes.length}`, 'color: #64748b;')
      console.log(`%c📊 元音数量: ${vowels.length}`, 'color: #10b981;')
      console.log(`%c📊 辅音数量: ${consonants.length}`, 'color: #3b82f6;')
    }
    
    const startIndex = savedPlayAllIndex.value > 0 && savedPlayAllIndex.value < allPhonemes.length 
      ? savedPlayAllIndex.value 
      : 0;
    
    playAllMode.value = true;
    playAllIndex.value = startIndex;
    
    if (startIndex > 0) {
      logger.info(`从第 ${startIndex + 1} 个音标继续播放`)
      if (import.meta.env.DEV) {
        console.log(`%c📊 保存的播放位置: 第 ${savedPlayAllIndex.value + 1} 个`, 'color: #64748b;')
      }
    }
    
    const PLAY_INTERVAL = 200;
    if (import.meta.env.DEV) {
      console.log(`%c📊 播放间隔: ${PLAY_INTERVAL}ms`, 'color: #64748b;')
    }
    
    const playStartTime = performance.now()
    let playedCount = 0
    
    const playNext = async () => {
      if (!playAllMode.value || playAllIndex.value >= allPhonemes.length) {
        const totalTime = performance.now() - playStartTime
        logger.success(`播放全部完成！共播放 ${playedCount} 个音标，总耗时 ${(totalTime / 1000).toFixed(1)}s`)
        stopAllPlayback();
        return;
      }
      
      cleanupAudio();
      
      const phoneme = allPhonemes[playAllIndex.value];
      if (import.meta.env.DEV) {
        console.log('%c━━━━━━━━━━━━━━━━ 播放进度 ━━━━━━━━━━━━━━━━', 'color: #3b82f6;')
        console.log(`%c🎵 正在播放: 第 ${playAllIndex.value + 1}/${allPhonemes.length} 个`, 'color: #3b82f6; font-weight: bold;')
        console.log(`%c   符号: ${phoneme.symbol}`, 'color: #64748b;')
        console.log(`%c   中文名: ${phoneme.chineseName}`, 'color: #64748b;')
        console.log(`%c   类型: ${phoneme.type === 'vowel' ? '元音' : '辅音'}`, 'color: #64748b;')
      }
      
      const audioLoadStart = performance.now()
      const audio = new Audio(getAudioPath(phoneme.audioFile));
      currentAudio.value = audio;
      currentPhoneme.value = phoneme;
      isPlaying.value = true;
      
      if (!progress.value.includes(phoneme.symbol)) {
        progress.value.push(phoneme.symbol);
        saveToLocalStorage();
      }
      
      audio.onloadeddata = () => {
        const loadTime = performance.now() - audioLoadStart
        if (import.meta.env.DEV) {
          console.log(`%c   音频加载: ${loadTime.toFixed(2)}ms`, 'color: #64748b;')
        }
      }
      
      audio.onended = () => {
        playedCount++
        playAllIndex.value++;
        if (playAllMode.value && playAllIndex.value < allPhonemes.length) {
          savedPlayAllIndex.value = playAllIndex.value;
          saveToLocalStorage();
          currentPhoneme.value = null;
          isPlaying.value = false;
          currentAudio.value = null;
          setTimeout(() => {
            if (playAllMode.value) {
              playNext();
            }
          }, PLAY_INTERVAL);
        } else {
          savedPlayAllIndex.value = 0;
          saveToLocalStorage();
          logger.success('播放全部完成，已重置播放位置')
          stopAllPlayback();
        }
      };
      
      audio.onerror = () => {
        logger.error(`音频加载失败: ${phoneme.audioFile}`)
        playAllIndex.value++;
        savedPlayAllIndex.value = playAllIndex.value;
        saveToLocalStorage();
        setTimeout(() => {
          if (playAllMode.value) {
            playNext();
          }
        }, PLAY_INTERVAL);
      };
      
      const playSuccess = await playAudioWithWechatCompat(audio);
      if (!playSuccess) {
        logger.warning(`播放失败，跳过: ${phoneme.symbol}`)
        playAllIndex.value++;
        savedPlayAllIndex.value = playAllIndex.value;
        saveToLocalStorage();
        setTimeout(() => {
          if (playAllMode.value) {
            playNext();
          }
        }, PLAY_INTERVAL);
      }
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
    savedPlayAllIndex,
    isWechatBrowser,
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
    clearFavorites,
    initAudioContext
  };
});

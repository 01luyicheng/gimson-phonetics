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
import { cleanupAudioElement } from '@/utils/audio';

/**
 * 扩展 Window 接口以支持 webkitAudioContext
 * webkitAudioContext 是 Safari 和旧版 Chrome 中的前缀实现
 */
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

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
  isLoading: boolean;
  loadingPhonemeSymbol: string | null;
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
  const isLoading = ref(false);
  const loadingPhonemeSymbol = ref<string | null>(null);
  
  // 播放全部模式的取消标记
  let playAllCancelToken: { cancelled: boolean } | null = null;
  
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
    
    loadFromLocalStorage();
    if (import.meta.env.DEV) {
      console.log(`%c📊 存储可用性：${isLocalStorageAvailable ? 'localStorage' : '内存存储'}`, 'color: #64748b;')
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

  // 内存存储作为降级方案
  const memoryStorage = {
    favorites: [] as string[],
    progress: [] as string[],
    playAllIndex: 0
  };
  
  let isLocalStorageAvailable = true;

  /**
   * 检查 localStorage 可用性
   * 每次保存前都检查，不永久放弃 localStorage
   */
  const checkLocalStorageAvailability = () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      if (!isLocalStorageAvailable) {
        logger.success('localStorage 已恢复可用');
      }
      isLocalStorageAvailable = true;
      return true;
    } catch (e) {
      if (isLocalStorageAvailable) {
        logger.warning('localStorage 不可用，将使用内存存储');
      }
      isLocalStorageAvailable = false;
      return false;
    }
  };

  const saveToLocalStorage = () => {
    // 每次保存前都检查 localStorage 可用性
    if (!checkLocalStorageAvailability()) {
      // 降级到内存存储
      memoryStorage.favorites = [...favorites.value];
      memoryStorage.progress = [...progress.value];
      memoryStorage.playAllIndex = savedPlayAllIndex.value;
      return;
    }
    
    try {
      localStorage.setItem('ipa-favorites', JSON.stringify(favorites.value));
      localStorage.setItem('ipa-progress', JSON.stringify(progress.value));
      localStorage.setItem('ipa-playall-index', savedPlayAllIndex.value.toString());
    } catch (e) {
      console.error('%c❌ 保存到 localStorage 失败:', 'color: #ef4444;', e);
      isLocalStorageAvailable = false;
      memoryStorage.favorites = [...favorites.value];
      memoryStorage.progress = [...progress.value];
      memoryStorage.playAllIndex = savedPlayAllIndex.value;
      logger.warning('已切换到内存存储模式');
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedFavorites = localStorage.getItem('ipa-favorites');
      const savedProgress = localStorage.getItem('ipa-progress');
      const savedPlayAllIndexStr = localStorage.getItem('ipa-playall-index');
      
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          if (Array.isArray(parsed)) {
            favorites.value = parsed;
            if (import.meta.env.DEV) {
              console.log(`%c⭐ 已加载收藏：${favorites.value.length} 个`, 'color: #10b981;')
            }
          } else {
            logger.warning('收藏数据格式不正确，使用空数组');
            favorites.value = [];
          }
        } catch (e) {
          logger.error('解析收藏数据失败', e);
          favorites.value = [];
        }
      }
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          if (Array.isArray(parsed)) {
            progress.value = parsed;
            if (import.meta.env.DEV) {
              console.log(`%c📈 已加载学习进度：${progress.value.length} 个音标`, 'color: #10b981;')
            }
          } else {
            logger.warning('进度数据格式不正确，使用空数组');
            progress.value = [];
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
            console.log(`%c🎵 已加载播放位置：第 ${parsedIndex + 1} 个音标`, 'color: #10b981;')
          }
        }
      }
    } catch (e) {
      console.error('%c❌ 从 localStorage 加载失败:', 'color: #ef4444;', e);
      // 加载失败时降级到内存存储，不永久放弃 localStorage
      isLocalStorageAvailable = false;
    }
    
    if (import.meta.env.DEV) {
      console.log(`%c📋 总音标数量：${phonemes.value.length} (元音：${vowels.length}, 辅音：${consonants.length})`, 'color: #10b981;')
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
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioContext.value = new AudioContextClass();
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
    const wasCleaned = cleanupAudioElement(currentAudio.value, {
      resetCurrentTime: true,
      logMessage: '清理音频资源',
      enableLog: true
    });
    if (wasCleaned) {
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
    // 修复：设置取消标记，通知 playNext 停止播放
    if (playAllCancelToken) {
      playAllCancelToken.cancelled = true;
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
    
    // 设置加载状态
    isLoading.value = true;
    loadingPhonemeSymbol.value = phoneme.symbol;
    
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
      // 清除加载状态
      isLoading.value = false;
      loadingPhonemeSymbol.value = null;
      logger.performance(`音频加载完成：${phoneme.symbol} (${loadTime.toFixed(2)}ms)`)
      if (import.meta.env.DEV) {
        console.log(`%c📊 音频时长：${audio.duration.toFixed(2)}s`, 'color: #64748b;')
        console.log(`%c📊 音频状态：readyState=${audio.readyState}`, 'color: #64748b;')
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
      // 清除加载状态
      isLoading.value = false;
      loadingPhonemeSymbol.value = null;
      
      // 区分不同的错误类型
      const errorCode = audio.error?.code;
      let errorMessage = '音频加载失败';
      let errorType = 'unknown';
      
      if (errorCode === 1) {
        errorType = 'network';
        errorMessage = '网络错误，音频文件无法下载';
      } else if (errorCode === 2) {
        errorType = 'decode';
        errorMessage = '音频文件解码失败，文件格式可能不正确';
      } else if (errorCode === 3) {
        errorType = 'support';
        errorMessage = '浏览器不支持此音频格式';
      } else if (errorCode === 4) {
        errorType = 'notfound';
        errorMessage = '音频文件不存在';
      }
      
      logger.error(`${errorMessage}: ${phoneme.audioFile} (错误类型：${errorType})`)
      if (import.meta.env.DEV) {
        console.error(`%c❌ 错误代码：${errorCode}`, 'color: #ef4444;')
        console.error(`%c❌ 错误消息：${audio.error?.message}`, 'color: #ef4444;')
        console.error(`%c❌ 错误类型：${errorType}`, 'color: #ef4444;')
      }
      
      // 存储错误信息供组件使用
      const errorInfo = {
        symbol: phoneme.symbol,
        message: errorMessage,
        type: errorType,
        timestamp: Date.now()
      };
      
      // 触发自定义事件通知组件
      window.dispatchEvent(new CustomEvent('audio-error', { detail: errorInfo }));
      
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
      // 修复：重置加载状态
      isLoading.value = false;
      loadingPhonemeSymbol.value = null;
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
   * 显示播放全部进度
   * @param current 当前播放位置
   * @param total 总音标数量
   * @param symbol 当前音标符号
   */
  const showPlayAllProgress = (current: number, total: number, symbol: string) => {
    // 更新页面标题显示进度
    document.title = `(${current}/${total}) ${symbol} - 英语音标点读`;
  };

  /**
   * 关闭播放全部进度并恢复页面标题
   */
  const closePlayAllProgress = () => {
    document.title = '英语音标点读';
  };

  /**
   * 播放全部音标
   * 按顺序播放所有音标，每个音标之间有500ms间隔
   * 可被中断停止，停止后下次从上次位置继续播放
   * 已针对微信浏览器优化
   * 
   * 修复记录：
   * - 修复了音频事件竞态条件导致的跳过问题
   * - 添加了播放状态锁防止重复调用
   * - 等待音频加载完成后再播放
   * - 统一处理播放完成逻辑
   * - 修复：确保 isProcessing 锁在所有路径下正确释放
   * - 修复：移除重复的事件处理器定义
   * - 修复：增强取消标记检查覆盖所有异步操作
   */
  const playAllPhonemes = async () => {
    if (import.meta.env.DEV) {
      console.log('%c━━━━━━━━━━━━━━━━ 播放全部音标 ━━━━━━━━━━━━━━━━', 'color: #3b82f6; font-weight: bold;')
    }
    logger.info('播放全部音标模式')
    
    if (playAllMode.value) {
      logger.warning('停止播放全部模式')
      stopAllPlayback();
      closePlayAllProgress();
      return;
    }
    
    // 创建新的取消标记
    const cancelToken = { cancelled: false };
    playAllCancelToken = cancelToken;
    
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
    
    // 增加播放间隔，确保音频有足够时间加载和播放
    const PLAY_INTERVAL = 500;
    // 音频加载超时时间（10秒）
    const LOAD_TIMEOUT = 10000;
    if (import.meta.env.DEV) {
      console.log(`%c📊 播放间隔: ${PLAY_INTERVAL}ms`, 'color: #64748b;')
      console.log(`%c📊 加载超时: ${LOAD_TIMEOUT}ms`, 'color: #64748b;')
    }
    
    const playStartTime = performance.now()
    let playedCount = 0
    // 播放状态锁，防止竞态条件导致的重复调用
    let isProcessing = false
    
    const playNext = async () => {
      // 检查取消标记 - 在函数入口处立即检查
      if (cancelToken.cancelled) {
        logger.info('播放全部模式已取消，停止播放');
        stopAllPlayback();
        closePlayAllProgress();
        return;
      }

      // 检查播放模式状态
      if (!playAllMode.value) {
        if (import.meta.env.DEV) {
          console.log('%c⏹️ 播放模式已关闭，停止播放', 'color: #f59e0b;')
        }
        closePlayAllProgress();
        return;
      }

      // 检查是否播放完成
      if (playAllIndex.value >= allPhonemes.length) {
        const totalTime = performance.now() - playStartTime
        logger.success(`播放全部完成！共播放 ${playedCount} 个音标，总耗时 ${(totalTime / 1000).toFixed(1)}s`)
        stopAllPlayback();
        closePlayAllProgress();
        return;
      }

      // 防止重复调用（竞态条件保护）
      if (isProcessing) {
        if (import.meta.env.DEV) {
          console.log('%c⏳ 正在处理中，跳过本次调用', 'color: #f59e0b;')
        }
        return;
      }
      isProcessing = true;

      // 再次检查取消标记（获取锁后）
      if (cancelToken.cancelled || !playAllMode.value) {
        isProcessing = false;
        stopAllPlayback();
        closePlayAllProgress();
        return;
      }

      cleanupAudio();
      
      const phoneme = allPhonemes[playAllIndex.value];
      if (!phoneme) {
        logger.error(`无法获取音标，索引: ${playAllIndex.value}`)
        playAllIndex.value++;
        isProcessing = false;
        setTimeout(() => {
          if (playAllMode.value && !cancelToken.cancelled) {
            playNext();
          }
        }, PLAY_INTERVAL);
        return;
      }
      
      // 显示播放进度
      showPlayAllProgress(playAllIndex.value + 1, allPhonemes.length, phoneme.symbol);
      
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
      
      // 标记是否已经处理过（防止事件竞态）
      let hasHandled = false;
      
      // 统一处理播放完成的逻辑
      const handleComplete = (success: boolean) => {
        // 防止重复处理（竞态条件保护）
        if (hasHandled) {
          if (import.meta.env.DEV) {
            console.log('%c⚠️ 已经处理过，跳过重复调用', 'color: #f59e0b;')
          }
          return;
        }
        hasHandled = true;
        
        if (success) {
          playedCount++;
        }
        
        playAllIndex.value++;
        
        // 检查是否还有更多音标需要播放
        if (playAllMode.value && playAllIndex.value < allPhonemes.length && !cancelToken.cancelled) {
          savedPlayAllIndex.value = playAllIndex.value;
          saveToLocalStorage();
          currentPhoneme.value = null;
          isPlaying.value = false;
          currentAudio.value = null;
          isProcessing = false; // 释放处理锁
          
          setTimeout(() => {
            // 在调度下一次播放前再次检查取消标记
            if (playAllMode.value && !cancelToken.cancelled) {
              playNext();
            }
          }, PLAY_INTERVAL);
        } else {
          // 播放完成或已取消
          savedPlayAllIndex.value = 0;
          saveToLocalStorage();
          if (playAllIndex.value >= allPhonemes.length) {
            const totalTime = performance.now() - playStartTime
            logger.success(`播放全部完成，已重置播放位置，共播放 ${playedCount} 个音标，总耗时 ${(totalTime / 1000).toFixed(1)}s`)
          }
          isProcessing = false; // 确保释放处理锁
          stopAllPlayback();
          closePlayAllProgress();
        }
      };
      
      // 设置加载超时保护
      const loadTimeoutId = setTimeout(() => {
        if (!hasHandled) {
          logger.warning(`音频加载超时: ${phoneme.symbol}`)
          handleComplete(false);
        }
      }, LOAD_TIMEOUT);
      
      // 清理超时定时器的辅助函数
      const clearLoadTimeout = () => {
        clearTimeout(loadTimeoutId);
      };
      
      // 音频加载完成事件
      audio.onloadeddata = () => {
        const loadTime = performance.now() - audioLoadStart
        if (import.meta.env.DEV) {
          console.log(`%c   音频加载: ${loadTime.toFixed(2)}ms`, 'color: #64748b;')
        }
      }
      
      // 音频播放结束事件 - 统一使用 handleComplete
      audio.onended = () => {
        clearLoadTimeout();
        if (import.meta.env.DEV) {
          console.log(`%c✅ 播放完成: ${phoneme.symbol}`, 'color: #10b981;')
        }
        handleComplete(true);
      };
      
      // 音频错误事件 - 统一使用 handleComplete
      audio.onerror = () => {
        clearLoadTimeout();
        const errorCode = audio.error?.code;
        let errorType = 'unknown';
        if (errorCode === 1) errorType = 'network';
        else if (errorCode === 2) errorType = 'decode';
        else if (errorCode === 3) errorType = 'support';
        else if (errorCode === 4) errorType = 'notfound';
        logger.error(`音频加载失败: ${phoneme.audioFile} (错误类型: ${errorType})`)
        handleComplete(false);
      };
      
      // 尝试播放音频
      try {
        // 再次检查取消标记（播放前）
        if (cancelToken.cancelled || !playAllMode.value) {
          clearLoadTimeout();
          isProcessing = false;
          stopAllPlayback();
          closePlayAllProgress();
          return;
        }
        
        const playSuccess = await playAudioWithWechatCompat(audio);
        
        // 播放后检查取消标记
        if (cancelToken.cancelled || !playAllMode.value) {
          clearLoadTimeout();
          isProcessing = false;
          stopAllPlayback();
          closePlayAllProgress();
          return;
        }
        
        if (!playSuccess) {
          clearLoadTimeout();
          logger.warning(`播放失败，跳过: ${phoneme.symbol}`)
          handleComplete(false);
        }
        // 如果 playSuccess 为 true，则等待 onended 或 onerror 事件触发 handleComplete
      } catch (err) {
        clearLoadTimeout();
        logger.error(`播放异常: ${phoneme.symbol}`, err)
        handleComplete(false);
      }
    };
    
    // 启动播放序列
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

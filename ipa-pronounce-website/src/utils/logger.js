/**
 * 调试日志工具模块
 * 文件用途：提供统一的调试日志功能，包括性能监控、网络状态、用户行为追踪
 * 创建日期：2026-02-17
 * 输入：各类调试信息
 * 输出：格式化的控制台日志
 * 依赖列表：无外部依赖
 */

console.log('%c📦 logger.js 模块加载中...', 'color: #8b5cf6; font-weight: bold;')

const LOG_PREFIX = '[IPA]'
const LOG_STYLES = {
  info: 'color: #3b82f6;',
  success: 'color: #10b981;',
  warning: 'color: #f59e0b;',
  error: 'color: #ef4444;',
  debug: 'color: #8b5cf6;',
  trace: 'color: #64748b;',
  performance: 'color: #ec4899;',
  network: 'color: #06b6d4;',
  user: 'color: #f97316;',
}

const isDev = import.meta.env.DEV

export const logger = {
  info(message, ...args) {
    console.log(`%c${LOG_PREFIX} ℹ️ ${message}`, LOG_STYLES.info, ...args)
  },

  success(message, ...args) {
    console.log(`%c${LOG_PREFIX} ✅ ${message}`, LOG_STYLES.success, ...args)
  },

  warning(message, ...args) {
    console.warn(`%c${LOG_PREFIX} ⚠️ ${message}`, LOG_STYLES.warning, ...args)
  },

  error(message, ...args) {
    console.error(`%c${LOG_PREFIX} ❌ ${message}`, LOG_STYLES.error, ...args)
  },

  debug(message, ...args) {
    if (isDev) {
      console.log(`%c${LOG_PREFIX} 🐛 ${message}`, LOG_STYLES.debug, ...args)
    }
  },

  trace(message, ...args) {
    if (isDev) {
      console.log(`%c${LOG_PREFIX} 📍 ${message}`, LOG_STYLES.trace, ...args)
      console.trace()
    }
  },

  performance(message, ...args) {
    console.log(`%c${LOG_PREFIX} ⚡ ${message}`, LOG_STYLES.performance, ...args)
  },

  network(message, ...args) {
    console.log(`%c${LOG_PREFIX} 🌐 ${message}`, LOG_STYLES.network, ...args)
  },

  user(message, ...args) {
    console.log(`%c${LOG_PREFIX} 👤 ${message}`, LOG_STYLES.user, ...args)
  },

  group(title, fn) {
    console.group(`%c${LOG_PREFIX} 📁 ${title}`, LOG_STYLES.debug)
    fn()
    console.groupEnd()
  },

  table(data, title) {
    if (title) {
      console.log(`%c${LOG_PREFIX} 📊 ${title}`, LOG_STYLES.info)
    }
    console.table(data)
  },

  time(label) {
    console.time(`${LOG_PREFIX} ⏱️ ${label}`)
  },

  timeEnd(label) {
    console.timeEnd(`${LOG_PREFIX} ⏱️ ${label}`)
  }
}

export function initNetworkMonitor() {
  console.log('%c━━━━━━━━━━━━━━━━ 网络状态监控初始化 ━━━━━━━━━━━━━━━━', 'color: #06b6d4; font-weight: bold;')
  
  const logNetworkStatus = () => {
    const status = navigator.onLine ? '在线' : '离线'
    const color = navigator.onLine ? LOG_STYLES.success : LOG_STYLES.error
    console.log(`%c${LOG_PREFIX} 🌐 网络状态: ${status}`, color)
    
    if (navigator.connection) {
      const conn = navigator.connection
      console.log(`%c${LOG_PREFIX} 🌐 连接类型: ${conn.effectiveType || '未知'}`, LOG_STYLES.network)
      console.log(`%c${LOG_PREFIX} 🌐 下行速度: ${conn.downlink || '未知'} Mbps`, LOG_STYLES.network)
      console.log(`%c${LOG_PREFIX} 🌐 RTT延迟: ${conn.rtt || '未知'} ms`, LOG_STYLES.network)
      console.log(`%c${LOG_PREFIX} 🌐 节省模式: ${conn.saveData ? '开启' : '关闭'}`, LOG_STYLES.network)
    }
  }

  logNetworkStatus()

  window.addEventListener('online', () => {
    console.log('%c━━━━━━━━━━━━━━━━ 网络状态变化 ━━━━━━━━━━━━━━━━', 'color: #10b981; font-weight: bold;')
    console.log(`%c${LOG_PREFIX} 🌐 网络已连接`, LOG_STYLES.success)
    logNetworkStatus()
  })

  window.addEventListener('offline', () => {
    console.log('%c━━━━━━━━━━━━━━━━ 网络状态变化 ━━━━━━━━━━━━━━━━', 'color: #ef4444; font-weight: bold;')
    console.log(`%c${LOG_PREFIX} 🌐 网络已断开`, LOG_STYLES.error)
    logNetworkStatus()
  })

  if (navigator.connection) {
    navigator.connection.addEventListener('change', () => {
      console.log('%c━━━━━━━━━━━━━━━━ 连接类型变化 ━━━━━━━━━━━━━━━━', 'color: #06b6d4; font-weight: bold;')
      logNetworkStatus()
    })
  }

  console.log('%c✅ 网络状态监控已初始化', 'color: #10b981;')
}

let fpsMonitor = null
let frameCount = 0
let lastTime = performance.now()
let fpsHistory = []

export function startFPSMonitor(interval = 1000) {
  if (fpsMonitor) {
    console.log('%c⚠️ FPS监控已在运行中', LOG_STYLES.warning)
    return
  }

  console.log('%c━━━━━━━━━━━━━━━━ FPS监控启动 ━━━━━━━━━━━━━━━━', 'color: #ec4899; font-weight: bold;')
  console.log(`%c${LOG_PREFIX} ⚡ FPS监控间隔: ${interval}ms`, LOG_STYLES.performance)

  const measureFPS = () => {
    frameCount++
    const now = performance.now()
    const elapsed = now - lastTime

    if (elapsed >= interval) {
      const fps = Math.round((frameCount * 1000) / elapsed)
      fpsHistory.push(fps)
      
      if (fpsHistory.length > 60) {
        fpsHistory.shift()
      }

      const avgFPS = Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length)
      const minFPS = Math.min(...fpsHistory)
      const maxFPS = Math.max(...fpsHistory)

      let fpsColor = LOG_STYLES.success
      if (fps < 30) fpsColor = LOG_STYLES.error
      else if (fps < 50) fpsColor = LOG_STYLES.warning

      console.log(`%c${LOG_PREFIX} ⚡ FPS: ${fps} (平均: ${avgFPS}, 最小: ${minFPS}, 最大: ${maxFPS})`, fpsColor)

      frameCount = 0
      lastTime = now
    }

    fpsMonitor = requestAnimationFrame(measureFPS)
  }

  fpsMonitor = requestAnimationFrame(measureFPS)
  console.log('%c✅ FPS监控已启动', 'color: #10b981;')
}

export function stopFPSMonitor() {
  if (fpsMonitor) {
    cancelAnimationFrame(fpsMonitor)
    fpsMonitor = null
    console.log('%c⏹️ FPS监控已停止', LOG_STYLES.warning)
  }
}

export function getFPSStats() {
  if (fpsHistory.length === 0) {
    return { avg: 0, min: 0, max: 0, current: 0 }
  }
  return {
    avg: Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length),
    min: Math.min(...fpsHistory),
    max: Math.max(...fpsHistory),
    current: fpsHistory[fpsHistory.length - 1]
  }
}

export function logMemoryUsage() {
  if (performance.memory) {
    const mem = performance.memory
    const usedMB = (mem.usedJSHeapSize / 1024 / 1024).toFixed(2)
    const totalMB = (mem.totalJSHeapSize / 1024 / 1024).toFixed(2)
    const limitMB = (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
    const usagePercent = ((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100).toFixed(1)

    console.log('%c━━━━━━━━━━━━━━━━ 内存使用情况 ━━━━━━━━━━━━━━━━', 'color: #ec4899; font-weight: bold;')
    console.log(`%c${LOG_PREFIX} 💾 已使用: ${usedMB} MB`, LOG_STYLES.performance)
    console.log(`%c${LOG_PREFIX} 💾 已分配: ${totalMB} MB`, LOG_STYLES.performance)
    console.log(`%c${LOG_PREFIX} 💾 限制: ${limitMB} MB`, LOG_STYLES.performance)
    console.log(`%c${LOG_PREFIX} 💾 使用率: ${usagePercent}%`, usagePercent > 80 ? LOG_STYLES.error : LOG_STYLES.performance)

    return { usedMB, totalMB, limitMB, usagePercent }
  } else {
    console.log(`%c${LOG_PREFIX} 💾 内存API不可用`, LOG_STYLES.warning)
    return null
  }
}

let memoryMonitorInterval = null

export function startMemoryMonitor(interval = 5000) {
  if (memoryMonitorInterval) {
    console.log('%c⚠️ 内存监控已在运行中', LOG_STYLES.warning)
    return
  }

  console.log('%c━━━━━━━━━━━━━━━━ 内存监控启动 ━━━━━━━━━━━━━━━━', 'color: #ec4899; font-weight: bold;')
  console.log(`%c${LOG_PREFIX} 💾 内存监控间隔: ${interval}ms`, LOG_STYLES.performance)

  logMemoryUsage()
  memoryMonitorInterval = setInterval(logMemoryUsage, interval)
  console.log('%c✅ 内存监控已启动', 'color: #10b981;')
}

export function stopMemoryMonitor() {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval)
    memoryMonitorInterval = null
    console.log('%c⏹️ 内存监控已停止', LOG_STYLES.warning)
  }
}

export function logAudioEvent(audio, eventName, details = {}) {
  console.log('%c━━━━━━━━━━━━━━━━ 音频事件 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log(`%c${LOG_PREFIX} 🎵 事件: ${eventName}`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 音频源: ${audio.src}`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 当前时间: ${audio.currentTime.toFixed(2)}s`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 总时长: ${audio.duration.toFixed(2)}s`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 音量: ${(audio.volume * 100).toFixed(0)}%`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 暂停: ${audio.paused}`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 🎵 结束: ${audio.ended}`, LOG_STYLES.debug)
  
  if (audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
    const bufferedPercent = ((bufferedEnd / audio.duration) * 100).toFixed(1)
    console.log(`%c${LOG_PREFIX} 🎵 缓冲进度: ${bufferedPercent}%`, LOG_STYLES.debug)
  }

  if (Object.keys(details).length > 0) {
    console.log(`%c${LOG_PREFIX} 🎵 详细信息:`, LOG_STYLES.debug, details)
  }
}

export function setupAudioLogging(audio, label = 'Audio') {
  console.log(`%c${LOG_PREFIX} 🎵 设置音频日志: ${label}`, LOG_STYLES.debug)

  audio.addEventListener('loadstart', () => {
    logAudioEvent(audio, 'loadstart', { label })
  })

  audio.addEventListener('loadedmetadata', () => {
    logAudioEvent(audio, 'loadedmetadata', { label })
  })

  audio.addEventListener('loadeddata', () => {
    logAudioEvent(audio, 'loadeddata', { label })
  })

  audio.addEventListener('canplay', () => {
    logAudioEvent(audio, 'canplay', { label })
  })

  audio.addEventListener('canplaythrough', () => {
    logAudioEvent(audio, 'canplaythrough', { label })
  })

  audio.addEventListener('play', () => {
    logAudioEvent(audio, 'play', { label })
  })

  audio.addEventListener('playing', () => {
    logAudioEvent(audio, 'playing', { label })
  })

  audio.addEventListener('pause', () => {
    logAudioEvent(audio, 'pause', { label })
  })

  audio.addEventListener('ended', () => {
    logAudioEvent(audio, 'ended', { label })
  })

  audio.addEventListener('error', (e) => {
    logAudioEvent(audio, 'error', { 
      label, 
      errorCode: audio.error?.code,
      errorMessage: audio.error?.message 
    })
  })

  audio.addEventListener('waiting', () => {
    logAudioEvent(audio, 'waiting', { label })
  })

  audio.addEventListener('stalled', () => {
    logAudioEvent(audio, 'stalled', { label })
  })

  audio.addEventListener('progress', () => {
    if (audio.buffered.length > 0) {
      const bufferedEnd = audio.buffered.end(audio.buffered.length - 1)
      const bufferedPercent = ((bufferedEnd / audio.duration) * 100).toFixed(1)
      console.log(`%c${LOG_PREFIX} 🎵 [${label}] 缓冲进度: ${bufferedPercent}%`, LOG_STYLES.trace)
    }
  })

  return audio
}

export function logUserAction(action, details = {}) {
  console.log('%c━━━━━━━━━━━━━━━━ 用户行为 ━━━━━━━━━━━━━━━━', 'color: #f97316; font-weight: bold;')
  console.log(`%c${LOG_PREFIX} 👤 动作: ${action}`, LOG_STYLES.user)
  console.log(`%c${LOG_PREFIX} 👤 时间: ${new Date().toLocaleTimeString()}`, LOG_STYLES.user)
  
  if (Object.keys(details).length > 0) {
    console.log(`%c${LOG_PREFIX} 👤 详情:`, LOG_STYLES.user, details)
  }
}

export function logComponentRender(componentName, props = {}) {
  console.log(`%c${LOG_PREFIX} 🎨 组件渲染: ${componentName}`, LOG_STYLES.debug)
  if (Object.keys(props).length > 0) {
    console.log(`%c${LOG_PREFIX} 🎨 Props:`, LOG_STYLES.debug, props)
  }
}

export function logComponentMount(componentName) {
  console.log(`%c${LOG_PREFIX} 🎨 组件挂载: ${componentName}`, LOG_STYLES.success)
}

export function logComponentUnmount(componentName) {
  console.log(`%c${LOG_PREFIX} 🎨 组件卸载: ${componentName}`, LOG_STYLES.warning)
}

export function measurePerformance(name, fn) {
  return async (...args) => {
    const startMark = `${name}-start`
    const endMark = `${name}-end`
    
    performance.mark(startMark)
    console.log(`%c${LOG_PREFIX} ⏱️ 开始测量: ${name}`, LOG_STYLES.performance)
    
    try {
      const result = await fn(...args)
      
      performance.mark(endMark)
      performance.measure(name, startMark, endMark)
      
      const measure = performance.getEntriesByName(name)[0]
      console.log(`%c${LOG_PREFIX} ⏱️ ${name} 耗时: ${measure.duration.toFixed(2)}ms`, LOG_STYLES.performance)
      
      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(name)
      
      return result
    } catch (error) {
      console.error(`%c${LOG_PREFIX} ⏱️ ${name} 执行出错:`, LOG_STYLES.error, error)
      throw error
    }
  }
}

export function createPerformanceTracker(name) {
  let startTime = null
  let measurements = []

  return {
    start() {
      startTime = performance.now()
      console.log(`%c${LOG_PREFIX} ⏱️ [${name}] 开始追踪`, LOG_STYLES.performance)
    },

    checkpoint(label) {
      if (startTime === null) {
        console.log(`%c${LOG_PREFIX} ⚠️ [${name}] 请先调用 start()`, LOG_STYLES.warning)
        return
      }

      const elapsed = performance.now() - startTime
      measurements.push({ label, elapsed })
      console.log(`%c${LOG_PREFIX} ⏱️ [${name}] ${label}: ${elapsed.toFixed(2)}ms`, LOG_STYLES.performance)
    },

    end() {
      if (startTime === null) {
        console.log(`%c${LOG_PREFIX} ⚠️ [${name}] 请先调用 start()`, LOG_STYLES.warning)
        return
      }

      const totalElapsed = performance.now() - startTime
      console.log(`%c${LOG_PREFIX} ⏱️ [${name}] 总耗时: ${totalElapsed.toFixed(2)}ms`, LOG_STYLES.performance)
      
      if (measurements.length > 0) {
        console.log(`%c${LOG_PREFIX} ⏱️ [${name}] 详细耗时:`, LOG_STYLES.performance)
        measurements.forEach(m => {
          console.log(`%c   - ${m.label}: ${m.elapsed.toFixed(2)}ms`, LOG_STYLES.performance)
        })
      }

      const result = { totalElapsed, measurements }
      startTime = null
      measurements = []
      return result
    }
  }
}

export function initGlobalErrorLogger() {
  console.log('%c━━━━━━━━━━━━━━━━ 全局错误日志初始化 ━━━━━━━━━━━━━━━━', 'color: #ef4444; font-weight: bold;')

  window.addEventListener('error', (event) => {
    console.log('%c━━━━━━━━━━━━━━━━ 全局错误 ━━━━━━━━━━━━━━━━', 'color: #ef4444; font-weight: bold;')
    console.error(`%c${LOG_PREFIX} ❌ 错误类型: ${event.type}`, LOG_STYLES.error)
    console.error(`%c${LOG_PREFIX} ❌ 错误消息: ${event.message}`, LOG_STYLES.error)
    console.error(`%c${LOG_PREFIX} ❌ 文件: ${event.filename}`, LOG_STYLES.error)
    console.error(`%c${LOG_PREFIX} ❌ 行号: ${event.lineno}, 列号: ${event.colno}`, LOG_STYLES.error)
    console.error(`%c${LOG_PREFIX} ❌ 错误对象:`, LOG_STYLES.error, event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.log('%c━━━━━━━━━━━━━━━━ 未处理的Promise拒绝 ━━━━━━━━━━━━━━━━', 'color: #ef4444; font-weight: bold;')
    console.error(`%c${LOG_PREFIX} ❌ Promise拒绝原因:`, LOG_STYLES.error, event.reason)
    console.error(`%c${LOG_PREFIX} ❌ Promise对象:`, LOG_STYLES.error, event.promise)
  })

  console.log('%c✅ 全局错误日志已初始化', 'color: #10b981;')
}

export function logStorageUsage() {
  console.log('%c━━━━━━━━━━━━━━━━ localStorage使用情况 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  
  let totalSize = 0
  const items = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const value = localStorage.getItem(key)
    const size = new Blob([value]).size
    totalSize += size
    items.push({ key, size: `${size} bytes`, value: value.substring(0, 50) + (value.length > 50 ? '...' : '') })
  }

  console.log(`%c${LOG_PREFIX} 💾 总大小: ${(totalSize / 1024).toFixed(2)} KB`, LOG_STYLES.debug)
  console.log(`%c${LOG_PREFIX} 💾 项目数量: ${localStorage.length}`, LOG_STYLES.debug)
  
  if (items.length > 0) {
    logger.table(items, 'localStorage项目')
  }

  return { totalSize, items }
}

export function initAllMonitors(options = {}) {
  console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #8b5cf6;')
  console.log('%c║           🔧 初始化所有监控器...                            ║', 'color: #8b5cf6; font-weight: bold;')
  console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #8b5cf6;')

  initGlobalErrorLogger()
  initNetworkMonitor()

  if (options.fps) {
    startFPSMonitor(options.fpsInterval || 1000)
  }

  if (options.memory) {
    startMemoryMonitor(options.memoryInterval || 5000)
  }

  console.log('%c✅ 所有监控器初始化完成', 'color: #10b981; font-weight: bold;')
}

export default {
  logger,
  initNetworkMonitor,
  startFPSMonitor,
  stopFPSMonitor,
  getFPSStats,
  logMemoryUsage,
  startMemoryMonitor,
  stopMemoryMonitor,
  logAudioEvent,
  setupAudioLogging,
  logUserAction,
  logComponentRender,
  logComponentMount,
  logComponentUnmount,
  measurePerformance,
  createPerformanceTracker,
  initGlobalErrorLogger,
  logStorageUsage,
  initAllMonitors
}

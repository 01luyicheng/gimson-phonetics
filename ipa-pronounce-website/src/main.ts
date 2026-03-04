import './assets/main.css'

import { createApp, version as vueVersion } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { initAllMonitors, logger, logStorageUsage, logMemoryUsage } from './utils/logger'

/**
 * PerformanceMemory 接口定义
 * 用于安全访问 Chrome 浏览器的内存信息
 */
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * 扩展 Performance 接口以包含 memory 属性
 */
interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

const startTime = performance.now()
const routerMode = router.options.history.constructor.name

console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #3b82f6;')
console.log('%c║        🚀 Gimson音标点读应用启动中...                          ║', 'color: #3b82f6; font-size: 14px; font-weight: bold;')
console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #3b82f6;')
console.log('%c━━━━━━━━━━━━━━━━ 环境信息 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
console.log(`%c📦 应用版本: ${import.meta.env.VITE_APP_VERSION || 'unknown'}`, 'color: #10b981;')
console.log(`%c🔧 Vue 版本: ${vueVersion}`, 'color: #10b981;')
console.log(`%c📋 Router 模式: ${routerMode}`, 'color: #10b981;')
console.log(`%c🌐 运行环境: ${import.meta.env.MODE}`, 'color: #10b981;')
console.log(`%c📍 基础路径: ${import.meta.env.BASE_URL}`, 'color: #10b981;')
console.log(`%c💻 用户代理: ${navigator.userAgent}`, 'color: #64748b;')
console.log(`%c📱 屏幕尺寸: ${window.innerWidth}x${window.innerHeight}`, 'color: #64748b;')
console.log(`%c🎨 设备像素比: ${window.devicePixelRatio}`, 'color: #64748b;')
console.log('%c━━━━━━━━━━━━━━━━ 插件加载 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')

console.log('%c⏳ 正在创建 Vue 应用实例...', 'color: #f59e0b;')
const app = createApp(App)
console.log('%c✅ Vue 应用实例创建完成', 'color: #10b981;')

console.log('%c⏳ 正在注册全局错误处理器...', 'color: #f59e0b;')
app.config.errorHandler = (err, instance, info) => {
  console.error('%c╔════════════════════════════════════════════════════════════╗', 'color: #ef4444;')
  console.error('%c║                    ❌ Vue 全局错误                          ║', 'color: #ef4444; font-weight: bold;')
  console.error('%c╚════════════════════════════════════════════════════════════╝', 'color: #ef4444;')
  console.error('%c🔥 错误对象:', 'color: #ef4444; font-weight: bold;', err)
  console.error('%c📍 组件实例:', 'color: #f59e0b;', instance)
  console.error('%cℹ️ 错误信息:', 'color: #f59e0b;', info)
  console.error('%c📚 错误堆栈:', 'color: #f59e0b;', (err as Error).stack)
}
console.log('%c✅ 全局错误处理器注册完成', 'color: #10b981;')

console.log('%c⏳ 正在注册全局警告处理器（开发模式）...', 'color: #f59e0b;')
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('%c⚠️ Vue 警告:', 'color: #f59e0b; font-weight: bold;', msg)
    console.warn('%c📍 组件:', 'color: #f59e0b;', instance)
    console.warn('%c📚 追踪:', 'color: #f59e0b;', trace)
  }
  console.log('%c✅ 全局警告处理器注册完成（仅开发模式）', 'color: #10b981;')
}

console.log('%c⏳ 正在注册 Element Plus 图标组件...', 'color: #f59e0b;')
const iconCount = Object.keys(ElementPlusIconsVue).length
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
console.log(`%c✅ 已注册 ${iconCount} 个 Element Plus 图标组件`, 'color: #10b981;')

console.log('%c⏳ 正在安装 Pinia 状态管理...', 'color: #f59e0b;')
const pinia = createPinia()
app.use(pinia)
console.log('%c✅ Pinia 状态管理安装完成', 'color: #10b981;')

console.log('%c⏳ 正在安装 Vue Router...', 'color: #f59e0b;')
app.use(router)
console.log('%c✅ Vue Router 安装完成', 'color: #10b981;')

console.log('%c━━━━━━━━━━━━━━━━ 应用挂载 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
console.log('%c⏳ 正在挂载应用到 #app...', 'color: #f59e0b;')

const mountStartTime = performance.now()
app.mount('#app')
const mountEndTime = performance.now()

const endTime = performance.now()
const totalTime = (endTime - startTime).toFixed(2)
const mountTime = (mountEndTime - mountStartTime).toFixed(2)

console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #10b981;')
console.log('%c║              🎉 应用启动成功！                              ║', 'color: #10b981; font-weight: bold;')
console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #10b981;')
console.log('%c━━━━━━━━━━━━━━━━ 性能统计 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
console.log(`%c⏱️ 总启动时间: ${totalTime}ms`, 'color: #10b981;')
console.log(`%c⏱️ 挂载时间: ${mountTime}ms`, 'color: #10b981;')
// 安全访问内存信息（Chrome 浏览器特有）
const perfWithMemory = performance as PerformanceWithMemory
const memoryUsage = perfWithMemory.memory?.usedJSHeapSize
  ? `${(perfWithMemory.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
  : 'N/A'
console.log(`%c💾 内存使用: ${memoryUsage}`, 'color: #10b981;')

if (import.meta.env.DEV) {
  console.log('%c━━━━━━━━━━━━━━━━ 调试提示 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log('%c💡 提示: 使用 window.__APP__ 访问应用实例', 'color: #64748b; font-style: italic;')
  console.log('%c💡 提示: 使用 window.__PINIA__ 访问 Pinia 实例', 'color: #64748b; font-style: italic;')
  console.log('%c💡 提示: 使用 window.__ROUTER__ 访问 Router 实例', 'color: #64748b; font-style: italic;')

  // 扩展 Window 接口以支持调试变量
  interface WindowWithDebug extends Window {
    __APP__?: typeof app;
    __PINIA__?: typeof pinia;
    __ROUTER__?: typeof router;
  }

  const windowWithDebug = window as WindowWithDebug
  windowWithDebug.__APP__ = app
  windowWithDebug.__PINIA__ = pinia
  windowWithDebug.__ROUTER__ = router

  console.log('%c✅ 全局调试变量已挂载到 window 对象', 'color: #10b981;')

  console.log('%c━━━━━━━━━━━━━━━━ 监控器初始化 ━━━━━━━━━━━━━━━━', 'color: #ec4899; font-weight: bold;')
  console.log('%c⏳ 正在初始化全局监控器...', 'color: #f59e0b;')

  initAllMonitors({ fps: true, memory: true })
}

if (import.meta.env.DEV) {
  console.log('%c⏳ 正在记录localStorage使用情况...', 'color: #f59e0b;')
  logStorageUsage()

  console.log('%c⏳ 正在记录初始内存使用...', 'color: #f59e0b;')
  logMemoryUsage()

  console.log('%c━━━━━━━━━━━━━━━━ 调试命令 ━━━━━━━━━━━━━━━━', 'color: #8b5cf6; font-weight: bold;')
  console.log('%c💡 可用的调试命令:', 'color: #64748b; font-style: italic;')
  console.log('%c   - window.__APP__       : Vue应用实例', 'color: #64748b;')
  console.log('%c   - window.__PINIA__     : Pinia状态管理实例', 'color: #64748b;')
  console.log('%c   - window.__ROUTER__    : Vue Router实例', 'color: #64748b;')
  console.log('%c   - logger               : 日志工具模块', 'color: #64748b;')
}

logger.success('应用启动完成！')
logger.info(`Vue版本: ${vueVersion}`)
logger.info(`运行模式: ${import.meta.env.MODE}`)
logger.info(`基础URL: ${import.meta.env.BASE_URL}`)

console.log('%c╔════════════════════════════════════════════════════════════╗', 'color: #10b981;')
console.log('%c║     🎉 欢迎使用Gimson音标点读应用！                          ║', 'color: #10b981; font-weight: bold;')
console.log('%c║     打开控制台可以查看详细的调试日志                        ║', 'color: #10b981;')
console.log('%c╚════════════════════════════════════════════════════════════╝', 'color: #10b981;')

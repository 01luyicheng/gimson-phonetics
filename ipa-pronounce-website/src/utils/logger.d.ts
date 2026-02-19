/**
 * 日志工具模块类型声明
 * 文件用途：为logger.js提供TypeScript类型支持
 * 创建日期：2026-02-18
 */

export interface Logger {
  info: (message: string, ...args: unknown[]) => void
  success: (message: string, ...args: unknown[]) => void
  warning: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  debug: (message: string, ...args: unknown[]) => void
  trace: (message: string, ...args: unknown[]) => void
  performance: (message: string, ...args: unknown[]) => void
  network: (message: string, ...args: unknown[]) => void
  user: (message: string, ...args: unknown[]) => void
  group: (title: string, fn: () => void) => void
  table: (data: unknown, title?: string) => void
  time: (label: string) => void
  timeEnd: (label: string) => void
}

export interface FPSStats {
  avg: number
  min: number
  max: number
  current: number
}

export interface PerformanceTracker {
  start: () => void
  checkpoint: (label: string) => void
  end: () => { totalElapsed: number; measurements: Array<{ label: string; elapsed: number }> }
}

export interface MemoryStats {
  usedMB: string
  totalMB: string
  limitMB: string
  usagePercent: string
}

export interface MonitorOptions {
  fps?: boolean
  fpsInterval?: number
  memory?: boolean
  memoryInterval?: number
}

export const logger: Logger

export function initNetworkMonitor(): void
export function startFPSMonitor(interval?: number): void
export function stopFPSMonitor(): void
export function getFPSStats(): FPSStats
export function logMemoryUsage(): MemoryStats | null
export function startMemoryMonitor(interval?: number): void
export function stopMemoryMonitor(): void
export function logAudioEvent(audio: HTMLAudioElement, eventName: string, details?: Record<string, unknown>): void
export function setupAudioLogging(audio: HTMLAudioElement, label?: string): HTMLAudioElement
export function logUserAction(action: string, details?: Record<string, unknown>): void
export function logComponentRender(componentName: string, props?: Record<string, unknown>): void
export function logComponentMount(componentName: string): void
export function logComponentUnmount(componentName: string): void
export function measurePerformance<T extends (...args: unknown[]) => Promise<unknown>>(name: string, fn: T): T
export function createPerformanceTracker(name: string): PerformanceTracker
export function initGlobalErrorLogger(): void
export function logStorageUsage(): { totalSize: number; items: Array<{ key: string; size: string; value: string }> }
export function initAllMonitors(options?: MonitorOptions): void

/**
 * 音频工具模块
 * 文件用途：提供音频相关的工具函数
 * 创建日期：2026-03-04
 * 输入输出签名：音频元素清理、事件管理
 * 依赖列表：logger
 */

import { logger } from '@/utils/logger';

/**
 * 清理音频元素的配置选项
 */
export interface CleanupAudioOptions {
  /** 是否重置播放位置到0 */
  resetCurrentTime?: boolean;
  /** 自定义日志消息 */
  logMessage?: string;
  /** 是否启用调试日志 */
  enableLog?: boolean;
}

/**
 * 清理音频元素资源
 * 
 * 功能说明：
 *   - 暂停音频播放
 *   - 重置播放位置（可选）
 *   - 移除所有事件监听器避免内存泄漏
 *   - 清空音频 src 释放资源
 *   - 触发 load() 强制释放资源
 *   - 清空引用
 * 
 * @param audio - 要清理的音频元素
 * @param options - 清理选项
 * @returns 是否成功执行了清理操作
 * 
 * @example
 * // 基本用法
 * cleanupAudioElement(audioRef.value);
 * 
 * // 带选项的用法
 * cleanupAudioElement(audioRef.value, {
 *   resetCurrentTime: true,
 *   logMessage: '清理音标音频资源',
 *   enableLog: true
 * });
 */
export function cleanupAudioElement(
  audio: HTMLAudioElement | null | undefined,
  options: CleanupAudioOptions = {}
): boolean {
  const {
    resetCurrentTime = false,
    logMessage = '清理音频资源',
    enableLog = true
  } = options;

  if (!audio) {
    return false;
  }

  if (enableLog) {
    logger.debug(logMessage);
  }

  // 暂停播放
  audio.pause();

  // 重置播放位置（可选）
  if (resetCurrentTime) {
    audio.currentTime = 0;
  }

  // 移除所有可能的事件监听器，避免内存泄漏
  // 按照 HTMLMediaElement 规范清理所有常用事件
  audio.onended = null;
  audio.onerror = null;
  audio.onloadeddata = null;
  audio.oncanplay = null;
  audio.oncanplaythrough = null;
  audio.onprogress = null;
  audio.ontimeupdate = null;
  audio.onwaiting = null;
  audio.onstalled = null;
  audio.onloadstart = null;
  audio.onemptied = null;
  audio.onplay = null;
  audio.onpause = null;
  audio.onplaying = null;
  audio.onseeked = null;
  audio.onseeking = null;
  audio.onvolumechange = null;
  audio.onloadedmetadata = null;
  audio.ondurationchange = null;
  audio.onratechange = null;

  // 清空 src 属性
  audio.src = '';

  // 调用 load() 强制释放资源
  audio.load();

  return true;
}

/**
 * 音频元素事件监听器类型
 */
export type AudioEventHandler = ((this: HTMLAudioElement, ev: Event) => void) | null;

/**
 * 安全的设置音频事件监听器
 * 用于确保事件监听器正确绑定并可在清理时被移除
 * 
 * @param audio - 音频元素
 * @param event - 事件名称
 * @param handler - 事件处理函数
 */
export function setAudioEventListener<K extends keyof HTMLMediaElementEventMap>(
  audio: HTMLAudioElement,
  event: K,
  handler: (this: HTMLAudioElement, ev: HTMLMediaElementEventMap[K]) => void
): void {
  audio[`on${event}` as keyof HTMLAudioElement] = handler as AudioEventHandler;
}

/**
 * 创建音频元素并配置基础设置
 * 
 * @param src - 音频源URL
 * @param options - 配置选项
 * @returns 配置好的音频元素
 */
export function createAudioElement(
  src: string,
  options: {
    preload?: HTMLMediaElement['preload'];
    loop?: boolean;
    volume?: number;
  } = {}
): HTMLAudioElement {
  const audio = new Audio(src);
  
  if (options.preload !== undefined) {
    audio.preload = options.preload;
  }
  
  if (options.loop !== undefined) {
    audio.loop = options.loop;
  }
  
  if (options.volume !== undefined) {
    audio.volume = options.volume;
  }

  return audio;
}

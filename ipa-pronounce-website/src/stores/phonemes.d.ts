/**
 * 音标状态管理Store类型声明
 * 文件用途：为phonemes.js提供TypeScript类型支持
 * 创建日期：2026-02-18
 */

import { Ref, ComputedRef } from 'vue'

export interface Phoneme {
  symbol: string
  name: string
  type: 'vowel' | 'consonant'
  category: string
  subCategory: string
  position: string
  rounded: boolean
  audioFile: string
  examples: string[]
  description: string
  englishName: string
  chineseName: string
}

export interface PhonemeStore {
  phonemes: Ref<Phoneme[]>
  favorites: Ref<string[]>
  progress: Ref<string[]>
  currentPhoneme: Ref<Phoneme | null>
  currentAudio: Ref<HTMLAudioElement | null>
  isPlaying: Ref<boolean>
  isLooping: Ref<boolean>
  loopPhonemeSymbol: Ref<string | null>
  searchQuery: Ref<string>
  playAllMode: Ref<boolean>
  playAllIndex: Ref<number>
  savedPlayAllIndex: Ref<number>
  audioContext: Ref<AudioContext | null>
  isWechatBrowser: Ref<boolean>
  filteredPhonemes: ComputedRef<Phoneme[]>
  favoritePhonemes: ComputedRef<Phoneme[]>
  progressPercentage: ComputedRef<number>
  initializeStore: () => void
  playPhoneme: (phoneme: Phoneme, loop?: boolean) => Promise<HTMLAudioElement>
  stopCurrentAudio: () => void
  stopAllPlayback: () => void
  stopPlaying: () => void
  toggleLoop: (phoneme: Phoneme) => Promise<void>
  toggleFavorite: (symbol: string) => void
  isFavorite: (symbol: string) => boolean
  isCurrentPlaying: (symbol: string) => boolean
  isCurrentLooping: (symbol: string) => boolean
  playAllPhonemes: () => Promise<void>
  clearProgress: () => void
  clearFavorites: () => void
  initAudioContext: () => void
}

export const usePhonemeStore: () => PhonemeStore

/**
 * IPA音标数据类型声明
 * 文件用途：为ipa-data.js提供TypeScript类型支持
 * 创建日期：2026-02-18
 */

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

export const ipaPhonemes: Phoneme[]
export const vowelCount: number
export const consonantCount: number
export const totalCount: number
export const vowels: Phoneme[]
export const consonants: Phoneme[]
export const monophthongs: Phoneme[]
export const diphthongs: Phoneme[]
export const plosives: Phoneme[]
export const fricatives: Phoneme[]
export const affricates: Phoneme[]
export const nasals: Phoneme[]
export const approximants: Phoneme[]

export function searchPhonemes(query: string): Phoneme[]
export function getPhonemeBySymbol(symbol: string): Phoneme | undefined
export function getAudioPath(audioFile: string): string
export function getCategoryLabel(category: string): string
export function getPositionLabel(position: string): string

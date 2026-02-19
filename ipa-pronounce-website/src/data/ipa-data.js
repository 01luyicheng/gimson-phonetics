/**
 * IPA英语音标数据配置文件
 * 文件用途：包含英语中会用到的44个Gimson音标的详细信息
 * 创建日期：2026-02-16
 * 数据来源：
 *   - 单元音(12个): Wikimedia Commons (Denelson83录制, CC BY-SA 3.0)
 *   - 双元音(8个): ipachart.app
 *   - 辅音(24个): Wikimedia Commons (Peter Isotalo录制, CC BY-SA 3.0)
 * 输入输出签名：导出音标数据数组和辅助函数
 * 依赖列表：无外部依赖
 */

if (import.meta.env.DEV) {
  console.log('%c📊 IPA音标数据模块加载中...', 'color: #3b82f6;')
}

export const ipaPhonemes = [
  // ==================== 单元音 - 前元音 ====================
  {
    symbol: 'iː',
    name: '长元音 iː',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'close',
    position: 'front',
    rounded: false,
    audioFile: 'sound_i.mp3',
    examples: ['see', 'tree', 'me', 'be', 'free'],
    description: '发音时舌前部抬高，嘴唇不圆，是长元音',
    englishName: 'Close front unrounded vowel',
    chineseName: '前闭不圆唇元音'
  },
  {
    symbol: 'ɪ',
    name: '短元音 ɪ',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'near-close',
    position: 'front',
    rounded: false,
    audioFile: 'sound_short_i.mp3',
    examples: ['sit', 'big', 'fish', 'happy', 'city'],
    description: '发音时舌前部稍抬高，嘴唇不圆，是短元音',
    englishName: 'Near-close near-front unrounded vowel',
    chineseName: '次闭次前不圆唇元音'
  },
  {
    symbol: 'e',
    name: '短元音 e',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'close-mid',
    position: 'front',
    rounded: false,
    audioFile: 'sound_e.mp3',
    examples: ['bed', 'red', 'head', 'said', 'friend'],
    description: '发音时舌前部中等高度，嘴唇不圆，是短元音',
    englishName: 'Close-mid front unrounded vowel',
    chineseName: '前半闭不圆唇元音'
  },
  {
    symbol: 'æ',
    name: '短元音 æ',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'near-open',
    position: 'front',
    rounded: false,
    audioFile: 'sound_æ.mp3',
    examples: ['cat', 'bad', 'man', 'apple', 'map'],
    description: '发音时舌前部较低，嘴巴张开较大，嘴唇不圆',
    englishName: 'Near-open front unrounded vowel',
    chineseName: '次开前不圆唇元音'
  },

  // ==================== 单元音 - 中元音 ====================
  {
    symbol: 'ɜː',
    name: '长元音 ɜː',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'open-mid',
    position: 'central',
    rounded: false,
    audioFile: 'sound_long_e.mp3',
    examples: ['bird', 'her', 'work', 'learn', 'world'],
    description: '发音时舌中部中等高度，嘴唇不圆，是长元音',
    englishName: 'Open-mid central unrounded vowel',
    chineseName: '中央半开不圆唇元音'
  },
  {
    symbol: 'ə',
    name: '短元音 ə',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'mid',
    position: 'central',
    rounded: false,
    audioFile: 'sound_ə.mp3',
    examples: ['about', 'teacher', 'father', 'sofa', 'banana'],
    description: '发音时舌中部中等高度，嘴唇自然，是弱读元音',
    englishName: 'Mid-central vowel (schwa)',
    chineseName: '中央元音（弱元音）'
  },
  {
    symbol: 'ʌ',
    name: '短元音 ʌ',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'open-mid',
    position: 'central',
    rounded: false,
    audioFile: 'sound_ʌ.mp3',
    examples: ['cup', 'love', 'mother', 'bus', 'lunch'],
    description: '发音时舌中部较低，嘴巴张开中等，嘴唇不圆',
    englishName: 'Open-mid back unrounded vowel',
    chineseName: '后半开不圆唇元音'
  },

  // ==================== 单元音 - 后元音 ====================
  {
    symbol: 'uː',
    name: '长元音 uː',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'close',
    position: 'back',
    rounded: true,
    audioFile: 'sound_long_u.mp3',
    examples: ['too', 'food', 'blue', 'moon', 'true'],
    description: '发音时舌后部抬高，嘴唇圆，是长元音',
    englishName: 'Close back rounded vowel',
    chineseName: '后闭圆唇元音'
  },
  {
    symbol: 'ʊ',
    name: '短元音 ʊ',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'near-close',
    position: 'back',
    rounded: true,
    audioFile: 'sound_u.mp3',
    examples: ['book', 'good', 'put', 'look', 'could'],
    description: '发音时舌后部稍抬高，嘴唇稍圆，是短元音',
    englishName: 'Near-close near-back rounded vowel',
    chineseName: '次闭次后圆唇元音'
  },
  {
    symbol: 'ɔː',
    name: '长元音 ɔː',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'open-mid',
    position: 'back',
    rounded: true,
    audioFile: 'sound_long_ɔ.mp3',
    examples: ['law', 'thought', 'more', 'door', 'four'],
    description: '发音时舌后部中等高度，嘴唇圆，是长元音',
    englishName: 'Open-mid back rounded vowel',
    chineseName: '后半开圆唇元音'
  },
  {
    symbol: 'ɒ',
    name: '短元音 ɒ',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'open',
    position: 'back',
    rounded: true,
    audioFile: 'sound_ɒ.mp3',
    examples: ['hot', 'dog', 'box', 'watch', 'want'],
    description: '发音时舌后部较低，嘴巴张开较大，嘴唇圆',
    englishName: 'Open back rounded vowel',
    chineseName: '后开元音'
  },
  {
    symbol: 'ɑː',
    name: '长元音 ɑː',
    type: 'vowel',
    category: 'monophthong',
    subCategory: 'open',
    position: 'back',
    rounded: false,
    audioFile: 'sound_long_ɑ.mp3',
    examples: ['car', 'father', 'hard', 'park', 'start'],
    description: '发音时舌后部最低，嘴巴张开最大，嘴唇不圆',
    englishName: 'Open back unrounded vowel',
    chineseName: '后开不圆唇元音'
  },

  // ==================== 双元音 ====================
  {
    symbol: 'eɪ',
    name: '双元音 eɪ',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'closing',
    position: 'front-to-front',
    rounded: false,
    audioFile: 'sound_eɪ.mp3',
    examples: ['day', 'say', 'make', 'great', 'name'],
    description: '从/e/滑动到/ɪ/，是合口双元音',
    englishName: 'Diphthong eɪ',
    chineseName: '合口双元音'
  },
  {
    symbol: 'aɪ',
    name: '双元音 aɪ',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'closing',
    position: 'front-to-front',
    rounded: false,
    audioFile: 'sound_aɪ.mp3',
    examples: ['my', 'time', 'like', 'high', 'night'],
    description: '从/a/滑动到/ɪ/，是合口双元音',
    englishName: 'Diphthong aɪ',
    chineseName: '合口双元音'
  },
  {
    symbol: 'ɔɪ',
    name: '双元音 ɔɪ',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'closing',
    position: 'back-to-front',
    rounded: true,
    audioFile: 'sound_ɔɪ.mp3',
    examples: ['boy', 'toy', 'voice', 'choice', 'enjoy'],
    description: '从/ɔ/滑动到/ɪ/，是合口双元音',
    englishName: 'Diphthong ɔɪ',
    chineseName: '合口双元音'
  },
  {
    symbol: 'əʊ',
    name: '双元音 əʊ',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'closing',
    position: 'central-to-back',
    rounded: true,
    audioFile: 'sound_əʊ.mp3',
    examples: ['go', 'no', 'home', 'show', 'know'],
    description: '从/ə/滑动到/ʊ/，是合口双元音',
    englishName: 'Diphthong əʊ',
    chineseName: '合口双元音'
  },
  {
    symbol: 'aʊ',
    name: '双元音 aʊ',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'closing',
    position: 'front-to-back',
    rounded: true,
    audioFile: 'sound_aʊ.mp3',
    examples: ['now', 'how', 'house', 'out', 'about'],
    description: '从/a/滑动到/ʊ/，是合口双元音',
    englishName: 'Diphthong aʊ',
    chineseName: '合口双元音'
  },
  {
    symbol: 'ɪə',
    name: '双元音 ɪə',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'centering',
    position: 'front-to-central',
    rounded: false,
    audioFile: 'sound_ɪə.mp3',
    examples: ['here', 'near', 'beer', 'fear', 'clear'],
    description: '从/ɪ/滑动到/ə/，是集中双元音',
    englishName: 'Diphthong ɪə',
    chineseName: '集中双元音'
  },
  {
    symbol: 'eə',
    name: '双元音 eə',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'centering',
    position: 'front-to-central',
    rounded: false,
    audioFile: 'sound_long_ə.mp3',
    examples: ['air', 'where', 'care', 'hair', 'there'],
    description: '从/e/滑动到/ə/，是集中双元音',
    englishName: 'Diphthong eə',
    chineseName: '集中双元音'
  },
  {
    symbol: 'ʊə',
    name: '双元音 ʊə',
    type: 'vowel',
    category: 'diphthong',
    subCategory: 'centering',
    position: 'back-to-central',
    rounded: true,
    audioFile: 'sound_ʊə.mp3',
    examples: ['tour', 'poor', 'sure', 'cure', 'pure'],
    description: '从/ʊ/滑动到/ə/，是集中双元音',
    englishName: 'Diphthong ʊə',
    chineseName: '集中双元音'
  },

  // ==================== 辅音 - 爆破音 ====================
  {
    symbol: 'p',
    name: '清辅音 p',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiceless',
    position: 'bilabial',
    rounded: false,
    audioFile: 'sound_p.mp3',
    examples: ['pen', 'top', 'help', 'open', 'happy'],
    description: '双唇爆破清辅音，声带不振动',
    englishName: 'Voiceless bilabial plosive',
    chineseName: '双唇清爆破音'
  },
  {
    symbol: 'b',
    name: '浊辅音 b',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiced',
    position: 'bilabial',
    rounded: false,
    audioFile: 'sound_b.mp3',
    examples: ['big', 'boy', 'job', 'about', 'baby'],
    description: '双唇爆破浊辅音，声带振动',
    englishName: 'Voiced bilabial plosive',
    chineseName: '双唇浊爆破音'
  },
  {
    symbol: 't',
    name: '清辅音 t',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiceless',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_t.mp3',
    examples: ['time', 'top', 'cat', 'water', 'better'],
    description: '齿龈爆破清辅音，声带不振动',
    englishName: 'Voiceless alveolar plosive',
    chineseName: '齿龈清爆破音'
  },
  {
    symbol: 'd',
    name: '浊辅音 d',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiced',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_d.mp3',
    examples: ['dog', 'day', 'red', 'and', 'made'],
    description: '齿龈爆破浊辅音，声带振动',
    englishName: 'Voiced alveolar plosive',
    chineseName: '齿龈浊爆破音'
  },
  {
    symbol: 'k',
    name: '清辅音 k',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiceless',
    position: 'velar',
    rounded: false,
    audioFile: 'sound_k.mp3',
    examples: ['cat', 'key', 'back', 'like', 'school'],
    description: '软腭爆破清辅音，声带不振动',
    englishName: 'Voiceless velar plosive',
    chineseName: '软腭清爆破音'
  },
  {
    symbol: 'g',
    name: '浊辅音 g',
    type: 'consonant',
    category: 'plosive',
    subCategory: 'voiced',
    position: 'velar',
    rounded: false,
    audioFile: 'sound_g.mp3',
    examples: ['go', 'get', 'big', 'dog', 'game'],
    description: '软腭爆破浊辅音，声带振动',
    englishName: 'Voiced velar plosive',
    chineseName: '软腭浊爆破音'
  },

  // ==================== 辅音 - 摩擦音 ====================
  {
    symbol: 'f',
    name: '清辅音 f',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiceless',
    position: 'labiodental',
    rounded: false,
    audioFile: 'sound_f.mp3',
    examples: ['fish', 'face', 'off', 'coffee', 'laugh'],
    description: '唇齿摩擦清辅音，声带不振动',
    englishName: 'Voiceless labiodental fricative',
    chineseName: '唇齿清摩擦音'
  },
  {
    symbol: 'v',
    name: '浊辅音 v',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiced',
    position: 'labiodental',
    rounded: false,
    audioFile: 'sound_v.mp3',
    examples: ['very', 'love', 'have', 'seven', 'even'],
    description: '唇齿摩擦浊辅音，声带振动',
    englishName: 'Voiced labiodental fricative',
    chineseName: '唇齿浊摩擦音'
  },
  {
    symbol: 'θ',
    name: '清辅音 θ',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiceless',
    position: 'dental',
    rounded: false,
    audioFile: 'sound_θ.mp3',
    examples: ['think', 'three', 'bath', 'tooth', 'method'],
    description: '齿间摩擦清辅音，声带不振动',
    englishName: 'Voiceless dental fricative',
    chineseName: '齿间清摩擦音'
  },
  {
    symbol: 'ð',
    name: '浊辅音 ð',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiced',
    position: 'dental',
    rounded: false,
    audioFile: 'sound_ð.mp3',
    examples: ['this', 'that', 'mother', 'father', 'weather'],
    description: '齿间摩擦浊辅音，声带振动',
    englishName: 'Voiced dental fricative',
    chineseName: '齿间浊摩擦音'
  },
  {
    symbol: 's',
    name: '清辅音 s',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiceless',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_s.mp3',
    examples: ['see', 'sun', 'bus', 'nice', 'city'],
    description: '齿龈摩擦清辅音，声带不振动',
    englishName: 'Voiceless alveolar fricative',
    chineseName: '齿龈清摩擦音'
  },
  {
    symbol: 'z',
    name: '浊辅音 z',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiced',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_z.mp3',
    examples: ['zoo', 'zero', 'easy', 'busy', 'nose'],
    description: '齿龈摩擦浊辅音，声带振动',
    englishName: 'Voiced alveolar fricative',
    chineseName: '齿龈浊摩擦音'
  },
  {
    symbol: 'ʃ',
    name: '清辅音 ʃ',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiceless',
    position: 'postalveolar',
    rounded: false,
    audioFile: 'sound_ʃ.mp3',
    examples: ['she', 'ship', 'wash', 'sure', 'ocean'],
    description: '后齿龈摩擦清辅音，声带不振动',
    englishName: 'Voiceless postalveolar fricative',
    chineseName: '后齿龈清摩擦音'
  },
  {
    symbol: 'ʒ',
    name: '浊辅音 ʒ',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiced',
    position: 'postalveolar',
    rounded: false,
    audioFile: 'sound_ʒ.mp3',
    examples: ['vision', 'measure', 'pleasure', 'usual', 'decision'],
    description: '后齿龈摩擦浊辅音，声带振动',
    englishName: 'Voiced postalveolar fricative',
    chineseName: '后齿龈浊摩擦音'
  },
  {
    symbol: 'h',
    name: '清辅音 h',
    type: 'consonant',
    category: 'fricative',
    subCategory: 'voiceless',
    position: 'glottal',
    rounded: false,
    audioFile: 'sound_h.mp3',
    examples: ['hello', 'house', 'happy', 'who', 'whole'],
    description: '声门摩擦清辅音，声带不振动',
    englishName: 'Voiceless glottal fricative',
    chineseName: '声门清摩擦音'
  },

  // ==================== 辅音 - 破擦音 ====================
  {
    symbol: 'tʃ',
    name: '清辅音 tʃ',
    type: 'consonant',
    category: 'affricate',
    subCategory: 'voiceless',
    position: 'postalveolar',
    rounded: false,
    audioFile: 'sound_ʧ.mp3',
    examples: ['church', 'chair', 'watch', 'much', 'nature'],
    description: '后齿龈破擦清辅音，声带不振动',
    englishName: 'Voiceless postalveolar affricate',
    chineseName: '后齿龈清破擦音'
  },
  {
    symbol: 'dʒ',
    name: '浊辅音 dʒ',
    type: 'consonant',
    category: 'affricate',
    subCategory: 'voiced',
    position: 'postalveolar',
    rounded: false,
    audioFile: 'sound_ʤ.mp3',
    examples: ['job', 'judge', 'age', 'large', 'general'],
    description: '后齿龈破擦浊辅音，声带振动',
    englishName: 'Voiced postalveolar affricate',
    chineseName: '后齿龈浊破擦音'
  },

  // ==================== 辅音 - 鼻音 ====================
  {
    symbol: 'm',
    name: '鼻音 m',
    type: 'consonant',
    category: 'nasal',
    subCategory: 'voiced',
    position: 'bilabial',
    rounded: false,
    audioFile: 'sound_m.mp3',
    examples: ['man', 'mother', 'some', 'time', 'come'],
    description: '双唇鼻音，声带振动',
    englishName: 'Bilabial nasal',
    chineseName: '双唇鼻音'
  },
  {
    symbol: 'n',
    name: '鼻音 n',
    type: 'consonant',
    category: 'nasal',
    subCategory: 'voiced',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_n.mp3',
    examples: ['no', 'name', 'man', 'know', 'nice'],
    description: '齿龈鼻音，声带振动',
    englishName: 'Alveolar nasal',
    chineseName: '齿龈鼻音'
  },
  {
    symbol: 'ŋ',
    name: '鼻音 ŋ',
    type: 'consonant',
    category: 'nasal',
    subCategory: 'voiced',
    position: 'velar',
    rounded: false,
    audioFile: 'sound_ŋ.mp3',
    examples: ['sing', 'long', 'thing', 'wrong', 'morning'],
    description: '软腭鼻音，声带振动',
    englishName: 'Velar nasal',
    chineseName: '软腭鼻音'
  },

  // ==================== 辅音 - 近音 ====================
  {
    symbol: 'l',
    name: '边音 l',
    type: 'consonant',
    category: 'approximant',
    subCategory: 'lateral',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_l.mp3',
    examples: ['like', 'love', 'look', 'little', 'well'],
    description: '齿龈边音，声带振动',
    englishName: 'Alveolar lateral approximant',
    chineseName: '齿龈边音'
  },
  {
    symbol: 'r',
    name: '近音 r',
    type: 'consonant',
    category: 'approximant',
    subCategory: 'central',
    position: 'alveolar',
    rounded: false,
    audioFile: 'sound_r.mp3',
    examples: ['red', 'run', 'right', 'very', 'sorry'],
    description: '齿龈近音，声带振动',
    englishName: 'Alveolar approximant',
    chineseName: '齿龈近音'
  },
  {
    symbol: 'w',
    name: '半元音 w',
    type: 'consonant',
    category: 'approximant',
    subCategory: 'semivowel',
    position: 'labio-velar',
    rounded: true,
    audioFile: 'sound_w.mp3',
    examples: ['we', 'what', 'water', 'one', 'when'],
    description: '唇软腭近音，声带振动',
    englishName: 'Voiced labio-velar approximant',
    chineseName: '唇软腭近音'
  },
  {
    symbol: 'j',
    name: '半元音 j',
    type: 'consonant',
    category: 'approximant',
    subCategory: 'semivowel',
    position: 'palatal',
    rounded: false,
    audioFile: 'sound_j.mp3',
    examples: ['yes', 'you', 'year', 'yellow', 'beyond'],
    description: '硬腭近音，声带振动',
    englishName: 'Palatal approximant',
    chineseName: '硬腭近音'
  }
];

export const vowelCount = 20;
export const consonantCount = 24;
export const totalCount = 44;

if (import.meta.env.DEV) {
  console.log(`%c📊 数据统计: 元音 ${vowelCount}个, 辅音 ${consonantCount}个, 共 ${totalCount}个`, 'color: #10b981;')
}

export const vowels = ipaPhonemes.filter(p => p.type === 'vowel');
export const consonants = ipaPhonemes.filter(p => p.type === 'consonant');

export const monophthongs = ipaPhonemes.filter(p => p.category === 'monophthong');
export const diphthongs = ipaPhonemes.filter(p => p.category === 'diphthong');

export const plosives = ipaPhonemes.filter(p => p.category === 'plosive');
export const fricatives = ipaPhonemes.filter(p => p.category === 'fricative');
export const affricates = ipaPhonemes.filter(p => p.category === 'affricate');
export const nasals = ipaPhonemes.filter(p => p.category === 'nasal');
export const approximants = ipaPhonemes.filter(p => p.category === 'approximant');

if (import.meta.env.DEV) {
  console.log('%c📊 音标分类统计:', 'color: #10b981;')
  console.log(`  - 单元音: ${monophthongs.length}个`)
  console.log(`  - 双元音: ${diphthongs.length}个`)
  console.log(`  - 爆破音: ${plosives.length}个`)
  console.log(`  - 摩擦音: ${fricatives.length}个`)
  console.log(`  - 破擦音: ${affricates.length}个`)
  console.log(`  - 鼻音: ${nasals.length}个`)
  console.log(`  - 近音: ${approximants.length}个`)
}

export function searchPhonemes(query) {
  if (import.meta.env.DEV) {
    console.log(`%c🔍 执行搜索: "${query}"`, 'color: #8b5cf6;')
  }
  const lowerQuery = query.toLowerCase();
  const results = ipaPhonemes.filter(p =>
    p.symbol.toLowerCase().includes(lowerQuery) ||
    p.name.toLowerCase().includes(lowerQuery) ||
    p.englishName.toLowerCase().includes(lowerQuery) ||
    p.chineseName.toLowerCase().includes(lowerQuery) ||
    p.examples.some(e => e.toLowerCase().includes(lowerQuery))
  );
  if (import.meta.env.DEV) {
    console.log(`%c🔍 搜索结果: ${results.length}个`, 'color: #10b981;')
  }
  return results;
}

export function getPhonemeBySymbol(symbol) {
  return ipaPhonemes.find(p => p.symbol === symbol);
}

export function getAudioPath(audioFile) {
  return `/ipa-audio/${audioFile}`;
}

export function getCategoryLabel(category) {
  const labels = {
    'monophthong': '单元音',
    'diphthong': '双元音',
    'plosive': '爆破音',
    'fricative': '摩擦音',
    'affricate': '破擦音',
    'nasal': '鼻音',
    'approximant': '近音'
  };
  return labels[category] || category;
}

export function getPositionLabel(position) {
  const labels = {
    'front': '前',
    'central': '中',
    'back': '后',
    'bilabial': '双唇',
    'labiodental': '唇齿',
    'dental': '齿间',
    'alveolar': '齿龈',
    'postalveolar': '后齿龈',
    'palatal': '硬腭',
    'velar': '软腭',
    'glottal': '声门',
    'labio-velar': '唇软腭'
  };
  return labels[position] || position;
}

export default {
  ipaPhonemes,
  vowels,
  consonants,
  monophthongs,
  diphthongs,
  plosives,
  fricatives,
  affricates,
  nasals,
  approximants,
  vowelCount,
  consonantCount,
  totalCount,
  searchPhonemes,
  getPhonemeBySymbol,
  getAudioPath,
  getCategoryLabel,
  getPositionLabel
};

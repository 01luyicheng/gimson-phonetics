/**
 * 单词发音音频下载脚本
 * 文件用途：从有道词典API下载示例单词的发音音频文件
 * 创建日期：2026-02-17
 * 输入输出签名：从有道API下载MP3文件到public/word-audio目录
 * 依赖列表：Node.js内置模块（https, fs, path）
 * 与其他模块交互：被开发者手动执行，为前端提供音频资源
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/word-audio');

const YOUDAO_API = 'https://dict.youdao.com/dictvoice';

const allWords = [
  'see', 'tree', 'me', 'be', 'free',
  'sit', 'big', 'fish', 'happy', 'city',
  'bed', 'red', 'head', 'said', 'friend',
  'cat', 'bad', 'man', 'apple', 'map',
  'bird', 'her', 'work', 'learn', 'world',
  'about', 'teacher', 'father', 'sofa', 'banana',
  'cup', 'love', 'mother', 'bus', 'lunch',
  'too', 'food', 'blue', 'moon', 'true',
  'book', 'good', 'put', 'look', 'could',
  'law', 'thought', 'more', 'door', 'four',
  'hot', 'dog', 'box', 'watch', 'want',
  'car', 'father', 'hard', 'park', 'start',
  'day', 'say', 'make', 'great', 'name',
  'my', 'time', 'like', 'high', 'night',
  'boy', 'toy', 'voice', 'choice', 'enjoy',
  'go', 'no', 'home', 'show', 'know',
  'now', 'how', 'house', 'out', 'about',
  'here', 'near', 'beer', 'fear', 'clear',
  'air', 'where', 'care', 'hair', 'there',
  'tour', 'poor', 'sure', 'cure', 'pure',
  'pen', 'top', 'help', 'open', 'happy',
  'big', 'boy', 'job', 'about', 'baby',
  'time', 'top', 'cat', 'water', 'better',
  'dog', 'day', 'red', 'and', 'made',
  'cat', 'key', 'back', 'like', 'school',
  'go', 'get', 'big', 'dog', 'game',
  'fish', 'face', 'off', 'coffee', 'laugh',
  'very', 'love', 'have', 'seven', 'even',
  'think', 'three', 'bath', 'tooth', 'method',
  'this', 'that', 'mother', 'father', 'weather',
  'see', 'sun', 'bus', 'nice', 'city',
  'zoo', 'zero', 'easy', 'busy', 'nose',
  'she', 'ship', 'wash', 'sure', 'ocean',
  'vision', 'measure', 'pleasure', 'usual', 'decision',
  'hello', 'house', 'happy', 'who', 'whole',
  'church', 'chair', 'watch', 'much', 'nature',
  'job', 'judge', 'age', 'large', 'general',
  'man', 'mother', 'some', 'time', 'come',
  'no', 'name', 'man', 'know', 'nice',
  'sing', 'long', 'thing', 'wrong', 'morning',
  'like', 'love', 'look', 'little', 'well',
  'red', 'run', 'right', 'very', 'sorry',
  'we', 'what', 'water', 'one', 'when',
  'yes', 'you', 'year', 'yellow', 'beyond'
];

const uniqueWords = [...new Set(allWords)].sort();

function downloadAudio(word, type = 0) {
  return new Promise((resolve, reject) => {
    const fileName = `${word}.mp3`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`[跳过] ${word} 已存在`);
      resolve({ word, status: 'skipped' });
      return;
    }
    
    const url = `${YOUDAO_API}?type=${type}&audio=${encodeURIComponent(word)}`;
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(filePath);
        reject(new Error(`下载失败: ${word}, 状态码: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`[成功] ${word}`);
        resolve({ word, status: 'success' });
      });
    }).on('error', (err) => {
      fs.unlinkSync(filePath);
      reject(err);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('========================================');
  console.log('单词发音音频下载脚本');
  console.log('========================================');
  console.log(`总单词数: ${uniqueWords.length}`);
  console.log(`输出目录: ${OUTPUT_DIR}`);
  console.log('========================================\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('创建输出目录成功\n');
  }
  
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < uniqueWords.length; i++) {
    const word = uniqueWords[i];
    console.log(`[${i + 1}/${uniqueWords.length}] 正在下载: ${word}`);
    
    try {
      const result = await downloadAudio(word, 0);
      if (result.status === 'success') {
        results.success++;
      } else {
        results.skipped++;
      }
      await sleep(100);
    } catch (error) {
      results.failed++;
      results.errors.push({ word, error: error.message });
      console.error(`[失败] ${word}: ${error.message}`);
    }
  }
  
  console.log('\n========================================');
  console.log('下载完成！');
  console.log('========================================');
  console.log(`成功下载: ${results.success}`);
  console.log(`已存在跳过: ${results.skipped}`);
  console.log(`下载失败: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n失败列表:');
    results.errors.forEach(({ word, error }) => {
      console.log(`  - ${word}: ${error}`);
    });
  }
  
  console.log('========================================');
}

main().catch(console.error);

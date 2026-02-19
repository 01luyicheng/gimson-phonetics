/**
 * Vue组件类型声明
 * 文件用途：为.vue文件提供TypeScript类型支持
 * 创建日期：2026-02-18
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

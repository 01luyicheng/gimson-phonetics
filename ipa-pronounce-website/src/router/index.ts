import { createRouter, createWebHistory } from 'vue-router'

console.log('%c🛤️ 路由模块初始化...', 'color: #3b82f6;')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/Favorites.vue'),
      meta: { title: '收藏夹' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(`%c➡️ 路由导航: ${String(from.name || 'null')} → ${String(to.name)}`, 'color: #8b5cf6; font-weight: bold;')
  next()
})

router.afterEach((to) => {
  console.log(`%c✅ 路由已切换到: ${String(to.name)}`, 'color: #10b981;')
})

router.onError((error) => {
  console.error('%c❌ 路由错误:', 'color: #ef4444;', error)
})

console.log('%c🛤️ 路由配置完成', 'color: #10b981;')

export default router

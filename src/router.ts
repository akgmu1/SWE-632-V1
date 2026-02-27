import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const ROUTES: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
]

const IS_DEV = import.meta.env.DEV
if (IS_DEV) {
  ROUTES.push({
    path: '/debug',
    component: () => import('@/views/DebugView.vue'),
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTES,
})

export default router

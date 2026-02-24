import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
  {
    path: '/update/:id',
    props: (route) => ({ todoId: Number(route.params.id) }),
    component: () => import('@/views/UpdateView.vue'),
  },
  {
    path: '/delete/:id',
    props: (route) => ({ todoId: Number(route.params.id) }),
    component: () => import('@/views/DeleteView.vue'),
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

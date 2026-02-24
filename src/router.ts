import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
})

export default router

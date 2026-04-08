import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/free-tools',
      name: 'free-tools',
      component: () => import('@/views/FreeToolsView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/BuilderView.vue'),
    },
    {
      path: '/tools/:slug',
      name: 'tool',
      component: () => import('@/views/ToolView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router

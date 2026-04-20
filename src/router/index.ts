import { createRouter, createWebHistory } from 'vue-router'
import { getToolBySlug } from '@/registry'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/all-tools',
      name: 'all-tools',
      component: () => import('@/views/AllToolsView.vue'),
    },
    {
      path: '/exclusive',
      name: 'exclusive',
      component: () => import('@/views/ExclusiveToolsView.vue'),
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

// Block exclusive tools for unauthenticated users
router.beforeEach((to) => {
  if (to.name === 'tool' && to.params.slug) {
    const tool = getToolBySlug(to.params.slug as string)
    if (tool?.meta.exclusive && !localStorage.getItem('glitchy_token')) {
      return { name: 'home' }
    }
  }
})

export default router

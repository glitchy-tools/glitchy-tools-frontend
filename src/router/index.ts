import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.hasInitialized) {
    await authStore.fetchUser()
  }

  // Guard exclusive tools — redirect unauthenticated users to home
  if (to.name === 'tool' && to.params.slug) {
    const tool = getToolBySlug(to.params.slug as string)
    if (tool?.meta.exclusive && !authStore.isAuthenticated) {
      return { name: 'home' }
    }
  }
})

export default router

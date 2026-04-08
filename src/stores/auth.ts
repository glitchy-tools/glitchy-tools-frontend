import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { authApi } from '@/api/auth'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const hasInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    if (hasInitialized.value) return
    try {
      isLoading.value = true
      user.value = await authApi.getMe()
      hasInitialized.value = true
    } catch (err) {
      user.value = null
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        hasInitialized.value = true
      }
    } finally {
      isLoading.value = false
    }
  }

  function clearAuth() {
    user.value = null
    hasInitialized.value = false
  }

  return {
    user,
    isLoading,
    hasInitialized,
    isAuthenticated,
    fetchUser,
    clearAuth,
  }
})

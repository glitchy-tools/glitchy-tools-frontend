import apiClient from './client'
import type { User } from '@/types'

export const authApi = {
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me')
    return data
  },
}

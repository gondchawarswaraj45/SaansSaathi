import { axiosClient } from './axiosClient'
import type { User } from '@/types'

export interface AuthResponseData {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export const authApi = {
  register: async (data: {
    fullName: string
    email: string
    password: string
    city?: string
    phone?: string
  }) => {
    const res = await axiosClient.post<{ data: AuthResponseData }>('/auth/register', data)
    return res.data.data
  },

  login: async (data: { email: string; password: string }) => {
    const res = await axiosClient.post<{ data: AuthResponseData }>('/auth/login', data)
    return res.data.data
  },

  refresh: async (refreshToken: string) => {
    const res = await axiosClient.post<{ data: AuthResponseData }>('/auth/refresh', {
      refreshToken,
    })
    return res.data.data
  },

  logout: async (refreshToken?: string) => {
    const res = await axiosClient.post('/auth/logout', { refreshToken })
    return res.data
  },

  getMe: async () => {
    const res = await axiosClient.get<{ data: User }>('/auth/me')
    return res.data.data
  },
}

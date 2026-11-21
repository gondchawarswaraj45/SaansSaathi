import { axiosClient } from './axiosClient'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalFamilyMembers: number
  totalIndoorAssessments: number
  totalMonitoringStations: number
  totalCitiesCovered: number
  totalChallenges: number
  systemUptimeHours: number
}

export interface AdminUser {
  id: number
  email: string
  fullName: string
  phone?: string
  role: 'USER' | 'ADMIN'
  active: boolean
  verified: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface ApiHealth {
  serviceName: string
  status: 'UP' | 'DEGRADED' | 'DOWN'
  latencyMs: number
  details: string
  lastChecked: string
}

export interface BroadcastRequest {
  title: string
  message: string
  type?: 'AQI_ALERT' | 'FAMILY_ALERT' | 'MORNING_BRIEFING' | 'INDOOR_TIP' | 'SYSTEM'
  actionUrl?: string
}

export const adminApi = {
  getStats: async () => {
    const res = await axiosClient.get('/admin/stats')
    return res.data?.data as AdminStats
  },

  getUsers: async () => {
    const res = await axiosClient.get('/admin/users')
    return res.data?.data as AdminUser[]
  },

  toggleUserStatus: async (userId: number) => {
    const res = await axiosClient.put(`/admin/users/${userId}/status`)
    return res.data?.data as AdminUser
  },

  getApiHealth: async () => {
    const res = await axiosClient.get('/admin/api-health')
    return res.data?.data as ApiHealth[]
  },

  broadcastNotification: async (data: BroadcastRequest) => {
    const res = await axiosClient.post('/admin/notifications/broadcast', data)
    return res.data?.data as number
  },
}

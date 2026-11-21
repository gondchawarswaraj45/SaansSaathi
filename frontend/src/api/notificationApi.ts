import { axiosClient } from './axiosClient'

export interface NotificationItem {
  id: number
  type: 'AQI_ALERT' | 'FAMILY_ALERT' | 'MORNING_BRIEFING' | 'INDOOR_TIP' | 'CHALLENGE_UPDATE' | 'SYSTEM'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
  readAt?: string
}

export interface UserPreference {
  id?: number
  userId?: number
  timezone?: string
  aqiAlertThreshold?: number
  morningBriefing?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
  darkMode?: boolean
  language?: string
}

export const notificationApi = {
  getNotifications: async (page = 0, size = 15) => {
    const res = await axiosClient.get(`/notifications?page=${page}&size=${size}`)
    return res.data?.data
  },

  getRecentUnread: async () => {
    const res = await axiosClient.get('/notifications/recent')
    return res.data?.data as NotificationItem[]
  },

  getUnreadCount: async () => {
    const res = await axiosClient.get('/notifications/unread-count')
    return (res.data?.data as number) || 0
  },

  markAsRead: async (id: number) => {
    const res = await axiosClient.put(`/notifications/${id}/read`)
    return res.data?.data as NotificationItem
  },

  markAllAsRead: async () => {
    const res = await axiosClient.put('/notifications/read-all')
    return res.data?.data
  },

  getPreferences: async () => {
    const res = await axiosClient.get('/notifications/preferences')
    return res.data?.data as UserPreference
  },

  updatePreferences: async (data: UserPreference) => {
    const res = await axiosClient.put('/notifications/preferences', data)
    return res.data?.data as UserPreference
  },

  triggerTestAlert: async (aqi = 325, location = 'Delhi / Anand Vihar') => {
    const res = await axiosClient.post(`/notifications/test-alert?aqi=${aqi}&location=${encodeURIComponent(location)}`)
    return res.data?.data as NotificationItem
  },
}

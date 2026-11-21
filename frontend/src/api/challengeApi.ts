import { axiosClient } from './axiosClient'

export interface CleanAirChallenge {
  id: number
  title: string
  description: string
  category: 'TRANSPORT' | 'HOME' | 'HEALTH' | 'COMMUNITY'
  durationDays: number
  pointsReward: number
  isActive: boolean
  isJoined?: boolean
  currentProgress?: number
  daysCompleted?: number
  isCompleted?: boolean
}

export interface ChallengeParticipant {
  id: number
  userId: number
  challengeId: number
  challengeTitle: string
  challengeDescription: string
  category: 'TRANSPORT' | 'HOME' | 'HEALTH' | 'COMMUNITY'
  durationDays: number
  startDate: string
  endDate?: string
  daysCompleted: number
  isCompleted: boolean
  completedAt?: string
  pointsEarned: number
  progressPercentage: number
}

export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  isUnlocked: boolean
  unlockedAt?: string
  points: number
}

export const challengeApi = {
  getAllChallenges: async () => {
    const res = await axiosClient.get('/challenges')
    return res.data?.data as CleanAirChallenge[]
  },

  getMyChallenges: async () => {
    const res = await axiosClient.get('/challenges/my')
    return res.data?.data as { active: ChallengeParticipant[]; completed: ChallengeParticipant[] }
  },

  joinChallenge: async (id: number) => {
    const res = await axiosClient.post(`/challenges/${id}/join`)
    return res.data?.data as ChallengeParticipant
  },

  leaveChallenge: async (id: number) => {
    const res = await axiosClient.delete(`/challenges/${id}/leave`)
    return res.data?.data
  },

  updateProgress: async (id: number, daysCompleted?: number) => {
    const res = await axiosClient.put(`/challenges/${id}/progress`, { daysCompleted })
    return res.data?.data as ChallengeParticipant
  },

  getBadges: async () => {
    const res = await axiosClient.get('/challenges/badges')
    return res.data?.data as UserBadge[]
  },

  getTotalPoints: async () => {
    const res = await axiosClient.get('/challenges/points')
    return (res.data?.data as number) || 0
  },
}

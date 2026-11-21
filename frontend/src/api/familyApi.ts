import { axiosClient } from './axiosClient'
import type { FamilyMember } from '@/types'

export interface MemberRecommendation {
  memberId: number
  memberName: string
  ageGroup: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  aqi: number
  precautions: string[]
}

export interface FamilyProtectionPlan {
  familyGroupId: number
  familyName: string
  currentAqi: number
  aqiCategory: string
  overallRiskSummary: string
  memberPlans: MemberRecommendation[]
}

export const familyApi = {
  getMembers: async () => {
    const res = await axiosClient.get<{ data: FamilyMember[] }>('/family/members')
    return res.data.data
  },

  addMember: async (data: Partial<FamilyMember>) => {
    const res = await axiosClient.post<{ data: FamilyMember }>('/family/members', data)
    return res.data.data
  },

  updateMember: async (id: number, data: Partial<FamilyMember>) => {
    const res = await axiosClient.put<{ data: FamilyMember }>(`/family/members/${id}`, data)
    return res.data.data
  },

  deleteMember: async (id: number) => {
    const res = await axiosClient.delete(`/family/members/${id}`)
    return res.data
  },

  getProtectionPlan: async (aqi: number = 285) => {
    const res = await axiosClient.get<{ data: FamilyProtectionPlan }>('/family/recommendations', {
      params: { aqi },
    })
    return res.data.data
  },
}

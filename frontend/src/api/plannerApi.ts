import { axiosClient } from './axiosClient'

export interface RoutineActivity {
  id: number
  routineId: number
  familyMemberId?: number
  familyMemberName?: string
  startTime: string
  endTime: string
  timeSlotFormatted: string
  activityName: string
  originalActivity?: string
  recommendation: string
  reason?: string
  type: 'OUTDOOR' | 'INDOOR' | 'TRAVEL' | 'EXERCISE' | 'WORK'
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  isCompleted: boolean
  completedAt?: string
}

export interface DailyRoutine {
  id: number
  userId: number
  routineDate: string
  generatedAt: string
  aqiAtGen: number
  aqiCategory: string
  isCustom: boolean
  bestOutdoorWindow: string
  completedActivitiesCount: number
  totalActivitiesCount: number
  compliancePercentage: number
  activities: RoutineActivity[]
}

export interface RoutineActivityRequest {
  familyMemberId?: number
  startTime: string
  endTime: string
  activityName: string
  originalActivity?: string
  recommendation?: string
  reason?: string
  type?: string
  riskLevel?: string
}

export interface WeeklyOverviewData {
  startDate: string
  endDate: string
  overallComplianceScore: number
  averageAqi: number
  totalActivitiesCompleted: number
  days: {
    date: string
    dayOfWeek: string
    aqi: number
    aqiCategory: string
    totalActivities: number
    completedActivities: number
    compliancePercentage: number
  }[]
}

export const plannerApi = {
  getTodayRoutine: async (aqi: number = 285) => {
    const res = await axiosClient.get<{ data: DailyRoutine }>('/routines', {
      params: { aqi },
    })
    return res.data.data
  },

  generateRoutine: async (date?: string, aqi: number = 285) => {
    const res = await axiosClient.post<{ data: DailyRoutine }>('/routines/generate', null, {
      params: { date, aqi },
    })
    return res.data.data
  },

  addActivity: async (routineId: number, data: RoutineActivityRequest) => {
    const res = await axiosClient.post<{ data: RoutineActivity }>(
      `/routines/${routineId}/activities`,
      data
    )
    return res.data.data
  },

  updateActivity: async (routineId: number, actId: number, data: RoutineActivityRequest) => {
    const res = await axiosClient.put<{ data: RoutineActivity }>(
      `/routines/${routineId}/activities/${actId}`,
      data
    )
    return res.data.data
  },

  toggleComplete: async (routineId: number, actId: number) => {
    const res = await axiosClient.post<{ data: RoutineActivity }>(
      `/routines/${routineId}/activities/${actId}/complete`
    )
    return res.data.data
  },

  deleteActivity: async (routineId: number, actId: number) => {
    const res = await axiosClient.delete(`/routines/${routineId}/activities/${actId}`)
    return res.data
  },

  getWeeklyOverview: async () => {
    const res = await axiosClient.get<{ data: WeeklyOverviewData }>('/routines/weekly')
    return res.data.data
  },
}

import { axiosClient } from './axiosClient'

export interface IndoorAssessmentRequest {
  roomCount: number
  windowCount: number
  floorNumber?: number
  totalFloors?: number
  hasAirPurifier: boolean
  hasExhaustFan: boolean
  hasChimney: boolean
  cookingFuel: string
  usesIncense: boolean
  usesMosquitoCoil: boolean
  hasSmokingMember: boolean
  budgetRupees: number
  hasChildren: boolean
  hasSeniors: boolean
  additionalNotes?: string
}

export interface IndoorRecommendation {
  id: string
  category: 'SOURCE_CONTROL' | 'VENTILATION' | 'FILTRATION' | 'CLEANING' | 'HABIT'
  title: string
  recommendation: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedCost: string
  source: string
  impactDescription?: string
  actionSteps: string[]
}

export interface IndoorAssessmentResponse {
  id: number
  userId: number
  roomCount: number
  windowCount: number
  floorNumber: number
  totalFloors: number
  hasAirPurifier: boolean
  hasExhaustFan: boolean
  hasChimney: boolean
  cookingFuel: string
  usesIncense: boolean
  usesMosquitoCoil: boolean
  hasSmokingMember: boolean
  budgetRupees: number
  hasChildren: boolean
  hasSeniors: boolean
  additionalNotes?: string
  createdAt?: string
  recommendations: IndoorRecommendation[]
  estimatedIndoorAqiScore: number
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
}

export interface CleanAirRoomGuide {
  title: string
  subtitle: string
  rationale: string
  setupSteps: {
    stepNumber: number
    title: string
    description: string
    tip: string
  }[]
  sizingTable: {
    roomCategory: string
    roomArea: string
    requiredCadr: string
    airChangesPerHour: string
    recommendedType: string
  }[]
  doItems: string[]
  dontItems: string[]
}

export interface DiyAirPurifierGuide {
  title: string
  subtitle: string
  scientificValidation: string
  estimatedCost: string
  filtrationEfficiency: string
  officialCitation: string
  materials: {
    name: string
    specification: string
    approximateCost: string
    isEssential: boolean
  }[]
  steps: {
    stepNumber: number
    title: string
    instructions: string
    tip: string
  }[]
  safetyPrecautions: string[]
}

export const indoorApi = {
  saveAssessment: async (data: IndoorAssessmentRequest) => {
    const res = await axiosClient.post<{ data: IndoorAssessmentResponse }>('/indoor/assessment', data)
    return res.data.data
  },

  getLatestAssessment: async () => {
    const res = await axiosClient.get<{ data: IndoorAssessmentResponse }>('/indoor/assessment')
    return res.data.data
  },

  getRecommendations: async () => {
    const res = await axiosClient.get<{ data: IndoorRecommendation[] }>('/indoor/recommendations')
    return res.data.data
  },

  getCleanAirRoomGuide: async () => {
    const res = await axiosClient.get<{ data: CleanAirRoomGuide }>('/indoor/clean-air-room')
    return res.data.data
  },

  getDIYAirPurifierGuide: async () => {
    const res = await axiosClient.get<{ data: DiyAirPurifierGuide }>('/indoor/diy-purifier-guide')
    return res.data.data
  },
}

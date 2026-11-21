export interface User {
  id: number
  email: string
  fullName: string
  phone?: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  createdAt?: string
}

export interface FamilyMember {
  id: number
  name: string
  ageGroup: 'CHILD' | 'ADULT' | 'SENIOR'
  sensitiveCategory: 'NONE' | 'RESPIRATORY' | 'CARDIOVASCULAR' | 'BOTH'
  dailyOutdoorHours: number
  workScheduleStart?: string
  workScheduleEnd?: string
  exercisePreference: 'OUTDOOR' | 'INDOOR' | 'NONE'
}

export interface PollutantMeasurement {
  code: string
  name: string
  value: number
  unit: string
  safeLimit: number
  subIndex?: number
}

export interface AqiData {
  aqi: number
  category: string
  dominantPollutant: string
  locationName: string
  stationName: string
  latitude: number
  longitude: number
  updatedAt: string
  isLive: boolean
  pollutants: PollutantMeasurement[]
  weather?: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    weatherCode: number
  }
}

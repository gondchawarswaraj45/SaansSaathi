import { axiosClient } from './axiosClient'

export interface MapStation {
  id: number
  name: string
  cityName: string
  areaName: string
  latitude: number
  longitude: number
  provider: string
  aqi: number
  category: 'GOOD' | 'SATISFACTORY' | 'MODERATE' | 'POOR' | 'VERY_POOR' | 'SEVERE'
  colorHex: string
  dominantPollutant: string
  pm25: number
  pm10: number
  lastUpdated: string
}

export interface MapPopupData {
  stationId: number
  stationName: string
  cityName: string
  areaName: string
  latitude: number
  longitude: number
  aqi: number
  category: string
  colorHex: string
  dominantPollutant: string
  pollutants: Record<
    string,
    {
      value: number
      unit: string
      safeLimit: number
    }
  >
  healthAdvisory: string
  lastUpdated: string
}

export const mapApi = {
  getStations: async (city?: string) => {
    const res = await axiosClient.get<{ data: MapStation[] }>('/map/stations', {
      params: { city: city === 'ALL' ? undefined : city },
    })
    return res.data.data
  },

  getStationPopup: async (stationId: number) => {
    const res = await axiosClient.get<{ data: MapPopupData }>(`/map/stations/${stationId}/popup`)
    return res.data.data
  },
}

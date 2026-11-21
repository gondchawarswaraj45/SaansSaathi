export type AqiCategory =
  | 'GOOD'
  | 'SATISFACTORY'
  | 'MODERATE'
  | 'POOR'
  | 'VERY_POOR'
  | 'SEVERE'

export interface AqiCategoryInfo {
  category: AqiCategory
  label: string
  range: [number, number]
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  summary: string
  advisories: {
    general: string
    sensitive: string
    outdoor: string
    indoor: string
    mask: string
  }
}

export const AQI_CATEGORIES: Record<AqiCategory, AqiCategoryInfo> = {
  GOOD: {
    category: 'GOOD',
    label: 'Good',
    range: [0, 50],
    color: '#55A630',
    bgColor: 'bg-aqi-good',
    textColor: 'text-aqi-good',
    borderColor: 'border-aqi-good',
    summary: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    advisories: {
      general: 'Normal outdoor activities are safe for everyone.',
      sensitive: 'No special precautions required.',
      outdoor: 'Great time for outdoor workouts and sports.',
      indoor: 'Open windows to let in fresh outdoor air.',
      mask: 'No mask required.',
    },
  },
  SATISFACTORY: {
    category: 'SATISFACTORY',
    label: 'Satisfactory',
    range: [51, 100],
    color: '#A7C957',
    bgColor: 'bg-aqi-satisfactory',
    textColor: 'text-aqi-satisfactory',
    borderColor: 'border-aqi-satisfactory',
    summary: 'Minor breathing discomfort to sensitive people.',
    advisories: {
      general: 'Acceptable air quality for most individuals.',
      sensitive: 'Unusually sensitive individuals should monitor respiratory symptoms.',
      outdoor: 'Outdoor activities are generally safe.',
      indoor: 'Ventilation is generally fine unless near a heavy traffic junction.',
      mask: 'Mask not typically required.',
    },
  },
  MODERATE: {
    category: 'MODERATE',
    label: 'Moderate',
    range: [101, 200],
    color: '#F4A261',
    bgColor: 'bg-aqi-moderate',
    textColor: 'text-aqi-moderate',
    borderColor: 'border-aqi-moderate',
    summary: 'Breathing discomfort to people with lungs, asthma, and heart diseases.',
    advisories: {
      general: 'Most people can carry on normal activities, but reduce prolonged exertion.',
      sensitive: 'Children, seniors, and asthma patients should limit strenuous outdoor exertion.',
      outdoor: 'Plan vigorous exercise early morning or late evening when AQI is lower.',
      indoor: 'Close windows facing main roads during peak traffic hours.',
      mask: 'Sensitive individuals should carry an N95 respirator if exposed to traffic.',
    },
  },
  POOR: {
    category: 'POOR',
    label: 'Poor',
    range: [201, 300],
    color: '#E76F51',
    bgColor: 'bg-aqi-poor',
    textColor: 'text-aqi-poor',
    borderColor: 'border-aqi-poor',
    summary: 'Breathing discomfort to most people on prolonged exposure.',
    advisories: {
      general: 'Avoid prolonged outdoor exertion. Switch workouts indoors.',
      sensitive: 'Children, elderly, and patients with cardiac/lung issues should stay indoors.',
      outdoor: 'Avoid outdoor exercise and unnecessary commutes.',
      indoor: 'Keep windows and doors closed. Run air purifier if available.',
      mask: 'Wear a well-fitted N95 mask when outdoors.',
    },
  },
  VERY_POOR: {
    category: 'VERY_POOR',
    label: 'Very Poor',
    range: [301, 400],
    color: '#D62828',
    bgColor: 'bg-aqi-verypoor',
    textColor: 'text-aqi-verypoor',
    borderColor: 'border-aqi-verypoor',
    summary: 'Respiratory illness on prolonged exposure. Pronounced effect on sensitive groups.',
    advisories: {
      general: 'Avoid unnecessary outdoor exposure. Severe smog warning.',
      sensitive: 'All sensitive groups must remain indoors.',
      outdoor: 'Cancel outdoor sports, jogging, and playground sessions.',
      indoor: 'Seal drafts, damp-mop floors, activate clean air room.',
      mask: 'N95/N99 respirator strictly recommended for all outdoor transit.',
    },
  },
  SEVERE: {
    category: 'SEVERE',
    label: 'Severe',
    range: [401, 500],
    color: '#6B0504',
    bgColor: 'bg-aqi-severe',
    textColor: 'text-aqi-severe',
    borderColor: 'border-aqi-severe',
    summary: 'Affects healthy people and seriously impacts those with existing diseases.',
    advisories: {
      general: 'Emergency air pollution condition. Strongly limit all outdoor exposure.',
      sensitive: 'Strict home isolation; keep rescue inhalers and medical aids nearby.',
      outdoor: 'Zero non-essential outdoor activity.',
      indoor: 'Operate HEPA filters continuously. Avoid cooking fumes and all smoke.',
      mask: 'High-grade N95/N99 mask mandatory for any emergency step outside.',
    },
  },
}

export function getAqiCategory(aqi: number): AqiCategoryInfo {
  if (aqi <= 50) return AQI_CATEGORIES.GOOD
  if (aqi <= 100) return AQI_CATEGORIES.SATISFACTORY
  if (aqi <= 200) return AQI_CATEGORIES.MODERATE
  if (aqi <= 300) return AQI_CATEGORIES.POOR
  if (aqi <= 400) return AQI_CATEGORIES.VERY_POOR
  return AQI_CATEGORIES.SEVERE
}

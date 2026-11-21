import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AIRecommendationCard } from './AIRecommendationCard'

describe('AIRecommendationCard Component', () => {
  it('displays Severe Smog Advisory and Clean Air Room protocol when AQI > 300', () => {
    render(
      <MemoryRouter>
        <AIRecommendationCard currentAqi={342} city="Delhi" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Severe Smog Advisory: Morning Inversion Active/i)).toBeInTheDocument()
    expect(screen.getByText(/Keep all windows sealed between 06:00 AM – 10:00 AM/i)).toBeInTheDocument()
    expect(screen.getByText(/AQI 342/i)).toBeInTheDocument()
    expect(screen.getByText(/View Sanctuary Protocol/i)).toBeInTheDocument()
  })

  it('displays Commute N95 Respirator advice when AQI is Poor (201-300)', () => {
    render(
      <MemoryRouter>
        <AIRecommendationCard currentAqi={240} city="Noida" />
      </MemoryRouter>
    )

    expect(screen.getByText(/High Winter Smog: Commute with N95 Respirators/i)).toBeInTheDocument()
    expect(screen.getByText(/Outdoor aerobic workouts should be shifted to indoor stationary training/i)).toBeInTheDocument()
    expect(screen.getByText(/AQI 240/i)).toBeInTheDocument()
  })

  it('displays Satisfactory Ventilation guidance when AQI is below 200', () => {
    render(
      <MemoryRouter>
        <AIRecommendationCard currentAqi={85} city="Bangalore" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Satisfactory Air Quality: Good Time for Midday Ventilation/i)).toBeInTheDocument()
    expect(screen.getByText(/AQI 85/i)).toBeInTheDocument()
  })
})

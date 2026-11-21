import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapLegend } from './MapLegend'

describe('MapLegend Component', () => {
  it('renders CPCB National AQI Scale header correctly', () => {
    render(<MapLegend />)
    expect(screen.getByText(/CPCB National AQI Scale/i)).toBeInTheDocument()
    expect(screen.getByText(/24-hr CPCB Standard/i)).toBeInTheDocument()
  })

  it('renders all 6 statutory Indian NAQI bands', () => {
    render(<MapLegend />)
    const expectedBands = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
    expectedBands.forEach((band) => {
      expect(screen.getByText(band)).toBeInTheDocument()
    })
  })

  it('displays accurate CPCB numeric ranges', () => {
    render(<MapLegend />)
    expect(screen.getByText('0–50')).toBeInTheDocument()
    expect(screen.getByText('51–100')).toBeInTheDocument()
    expect(screen.getByText('101–200')).toBeInTheDocument()
    expect(screen.getByText('201–300')).toBeInTheDocument()
    expect(screen.getByText('301–400')).toBeInTheDocument()
    expect(screen.getByText('401+')).toBeInTheDocument()
  })
})

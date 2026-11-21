export function MapLegend() {
  const bands = [
    { label: 'Good', range: '0–50', color: '#55A630' },
    { label: 'Satisfactory', range: '51–100', color: '#80B918' },
    { label: 'Moderate', range: '101–200', color: '#FFB703' },
    { label: 'Poor', range: '201–300', color: '#FB8500' },
    { label: 'Very Poor', range: '301–400', color: '#D62828' },
    { label: 'Severe', range: '401+', color: '#6B0504' },
  ]

  return (
    <div className="bg-card/95 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-md text-xs space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="font-extrabold uppercase text-[10px] tracking-wider text-muted-foreground">
          CPCB National AQI Scale (India)
        </span>
        <span className="text-[10px] text-muted-foreground">24-hr CPCB Standard</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {bands.map((b) => (
          <div
            key={b.label}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-white font-mono shadow-xs text-center"
            style={{ backgroundColor: b.color }}
          >
            <span className="text-xs font-black leading-none">{b.range}</span>
            <span className="text-[9px] font-sans font-bold opacity-95 tracking-tight mt-0.5">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

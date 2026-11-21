import { useState } from 'react'
import { X, Plus, Clock } from 'lucide-react'
import type { RoutineActivityRequest } from '@/api/plannerApi'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: RoutineActivityRequest) => void
}

export function CustomActivityModal({ isOpen, onClose, onAdd }: Props) {
  const [startTime, setStartTime] = useState('16:00')
  const [endTime, setEndTime] = useState('17:00')
  const [activityName, setActivityName] = useState('')
  const [originalActivity, setOriginalActivity] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [reason, setReason] = useState('')
  const [type, setType] = useState('OUTDOOR')
  const [riskLevel, setRiskLevel] = useState('MEDIUM')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityName.trim()) return

    onAdd({
      startTime: startTime + ':00',
      endTime: endTime + ':00',
      activityName: activityName.trim(),
      originalActivity: originalActivity.trim() || undefined,
      recommendation: recommendation.trim() || activityName.trim(),
      reason: reason.trim() || undefined,
      type,
      riskLevel,
    })

    // Reset and close
    setActivityName('')
    setOriginalActivity('')
    setRecommendation('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-green-600" />
            <h3 className="font-bold text-base text-foreground">Add Custom Activity</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase">Activity Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Grocery Shopping, Coaching Class..."
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              >
                <option value="OUTDOOR">Outdoor Activity</option>
                <option value="INDOOR">Indoor Activity</option>
                <option value="TRAVEL">Commute / Travel</option>
                <option value="EXERCISE">Fitness / Sport</option>
                <option value="WORK">Office / School</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Exposure Risk</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase">
              SaansSaathi Low-Emission Hack (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Shift to metro or wear N95 mask"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs shadow-sm"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

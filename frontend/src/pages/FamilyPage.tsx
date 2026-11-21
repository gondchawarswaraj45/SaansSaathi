import { useState } from 'react'
import { Users, Plus, ShieldAlert, Heart, Activity, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import BackButton from '@/components/common/BackButton'

interface Member {
  id: number
  name: string
  role: string
  ageGroup: 'CHILD' | 'ADULT' | 'SENIOR'
  sensitivity: string
  outdoorHours: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  precautions: string[]
}

export default function FamilyPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: 'Aarav (Son)',
      role: 'Student (8 yrs)',
      ageGroup: 'CHILD',
      sensitivity: 'Developing lungs / Mild allergy',
      outdoorHours: 2.5,
      riskLevel: 'HIGH',
      precautions: [
        'Avoid outdoor school sports & playground when AQI > 200.',
        'Ensure properly fitted pediatric N95 mask for school bus commute.',
        'Hydrate frequently to clear particulate irritation in airways.',
      ],
    },
    {
      id: 2,
      name: 'Grandfather (Dad)',
      role: 'Senior Citizen (71 yrs)',
      ageGroup: 'SENIOR',
      sensitivity: 'Cardiovascular sensitivity / Asthma history',
      outdoorHours: 1.0,
      riskLevel: 'CRITICAL',
      precautions: [
        'Strictly avoid morning walks before 09:30 AM (inversion layer).',
        'Keep emergency bronchodilator / inhaler readily accessible.',
        'Stay inside the designated Clean Air Room with HEPA filtration.',
      ],
    },
    {
      id: 3,
      name: 'Priya (Wife)',
      role: 'Homemaker (36 yrs)',
      ageGroup: 'ADULT',
      sensitivity: 'None reported',
      outdoorHours: 1.5,
      riskLevel: 'MEDIUM',
      precautions: [
        'Turn on kitchen chimney/exhaust fan before lighting the gas stove.',
        'Replace dry broom sweeping with damp microfiber mopping.',
        'Avoid lighting dhoop, agarbatti, or mosquito coils indoors.',
      ],
    },
    {
      id: 4,
      name: 'Rahul (Self)',
      role: 'Office Employee (38 yrs)',
      ageGroup: 'ADULT',
      sensitivity: 'None reported',
      outdoorHours: 2.0,
      riskLevel: 'MEDIUM',
      precautions: [
        'Set car AC to cabin air recirculation mode during highway traffic.',
        'Shift outdoor evening jog to indoor home workout or gym.',
        'Wear N95 mask during 2-wheeler or walking commute.',
      ],
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newAge, setNewAge] = useState<'CHILD' | 'ADULT' | 'SENIOR'>('ADULT')

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return
    const newMember: Member = {
      id: Date.now(),
      name: newName,
      role: newRole || 'Family Member',
      ageGroup: newAge,
      sensitivity: 'General precautions',
      outdoorHours: 1.5,
      riskLevel: newAge === 'CHILD' || newAge === 'SENIOR' ? 'HIGH' : 'MEDIUM',
      precautions: [
        'Wear N95 mask during heavy traffic exposure.',
        'Shift high-exertion workouts indoors.',
      ],
    }
    setMembers([...members, newMember])
    setShowAddModal(false)
    setNewName('')
    setNewRole('')
    toast.success(`${newName} added to Family Protection Plan!`)
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <BackButton />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Family Protection Matrix</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Personalized, profile-specific defense protocols against high winter particulate levels.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-green-600 text-white font-semibold text-sm hover:bg-brand-green-700 shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Family Member
        </button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => {
          const isHighRisk = member.riskLevel === 'HIGH' || member.riskLevel === 'CRITICAL'
          return (
            <div
              key={member.id}
              className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                      member.ageGroup === 'CHILD'
                        ? 'bg-brand-sky-100 text-brand-sky-700 dark:bg-brand-sky-950 dark:text-brand-sky-300'
                        : member.ageGroup === 'SENIOR'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-brand-green-100 text-brand-green-700 dark:bg-brand-green-950 dark:text-brand-green-300'
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{member.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{member.role}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    member.riskLevel === 'CRITICAL'
                      ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950 dark:text-red-300'
                      : member.riskLevel === 'HIGH'
                      ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {member.riskLevel} RISK TODAY
                </span>
              </div>

              {/* Health Sensitivity Callout */}
              <div className="p-3 rounded-xl bg-muted/60 text-xs flex items-center gap-2 text-muted-foreground">
                <Heart className="w-4 h-4 text-red-500 shrink-0" />
                <span>
                  <strong>Sensitivity profile:</strong> {member.sensitivity}
                </span>
              </div>

              {/* Tailored Precautions List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Targeted Protection Measures:
                </span>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {member.precautions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-green-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg outdoor exposure: {member.outdoorHours} hrs/day</span>
                <span className="text-brand-green-600 font-semibold cursor-pointer hover:underline">
                  Edit Profile
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold">Add Family Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Diya (Daughter)"
                  required
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Role / Occupation</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. School Student (6 yrs)"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Age Group</label>
                <select
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-border bg-background text-sm"
                >
                  <option value="CHILD">Child (&lt; 14 yrs)</option>
                  <option value="ADULT">Adult (15 - 59 yrs)</option>
                  <option value="SENIOR">Senior Citizen (60+ yrs)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-green-600 text-white text-sm font-bold hover:bg-brand-green-700"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

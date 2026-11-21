import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wind, Lock, Mail, User, MapPin, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import ThemeToggle from '@/components/common/ThemeToggle'
import BackButton from '@/components/common/BackButton'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Pune')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast.error('Please fill in all required fields')
      return
    }
    setAuth(
      {
        id: 1,
        email,
        fullName,
        role: 'USER',
        isVerified: true,
      },
      'demo-jwt-token'
    )
    toast.success('Account created! Welcome to SaansSaathi.')
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12 relative transition-colors">
      <div className="absolute top-6 left-6">
        <BackButton variant="outline" />
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md mb-3">
            <Wind className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Create your Family Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Start protecting your loved ones from severe air pollution
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Sharma"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Primary City
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              >
                <option value="Delhi">Delhi / NCR</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm shadow-md shadow-brand-green-600/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-3 border-t border-border">
          Already registered?{' '}
          <Link to="/login" className="text-brand-green-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

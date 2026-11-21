import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wind, Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import ThemeToggle from '@/components/common/ThemeToggle'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }
    // Set authenticated state
    setAuth(
      {
        id: 1,
        email,
        fullName: email.split('@')[0],
        role: 'USER',
        isVerified: true,
      },
      'demo-jwt-token'
    )
    toast.success('Welcome back to SaansSaathi!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12 relative transition-colors">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md mb-3">
            <Wind className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in to SaansSaathi</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Access your family's air protection dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
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
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              />
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
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-brand-green-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-sm shadow-md shadow-brand-green-600/20 flex items-center justify-center gap-2 transition-all"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-green-600 font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  )
}

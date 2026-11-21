import { Link } from 'react-router-dom'
import { Wind, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background text-foreground">
      <div className="w-16 h-16 rounded-2xl bg-brand-green-100 dark:bg-brand-green-950 text-brand-green-700 flex items-center justify-center mb-4">
        <Wind className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        The air quality report or page you're searching for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-2.5 rounded-xl bg-brand-green-600 text-white font-semibold text-sm hover:bg-brand-green-700 flex items-center gap-2 shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  )
}

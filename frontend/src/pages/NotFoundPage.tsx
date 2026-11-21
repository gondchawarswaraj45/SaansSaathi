import { Wind } from 'lucide-react'
import BackButton from '@/components/common/BackButton'

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
      <div className="mt-6">
        <BackButton label="Go Back to Previous Page" variant="outline" className="text-sm px-5 py-2.5" />
      </div>
    </div>
  )
}

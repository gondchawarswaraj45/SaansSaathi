import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * PublicRoute – redirects authenticated users to /dashboard.
 * Used for login/register/landing pages.
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

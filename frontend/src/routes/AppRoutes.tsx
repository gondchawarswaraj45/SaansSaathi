import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Lazy-loaded pages (code splitting for performance)
const LandingPage       = lazy(() => import('@/pages/LandingPage'))
const LoginPage         = lazy(() => import('@/pages/LoginPage'))
const RegisterPage      = lazy(() => import('@/pages/RegisterPage'))
const OnboardingPage    = lazy(() => import('@/pages/OnboardingPage'))
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'))
const FamilyPage        = lazy(() => import('@/pages/FamilyPage'))
const IndoorPage        = lazy(() => import('@/pages/IndoorPage'))
const PlannerPage       = lazy(() => import('@/pages/PlannerPage'))
const MapPage           = lazy(() => import('@/pages/MapPage'))
const ChatPage          = lazy(() => import('@/pages/ChatPage'))
const ChallengesPage    = lazy(() => import('@/pages/ChallengesPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))
const SettingsPage      = lazy(() => import('@/pages/SettingsPage'))
const AdminPage         = lazy(() => import('@/pages/AdminPage'))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-green-200 border-t-brand-green-600 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading SaansSaathi…</p>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Onboarding (after first login, before dashboard) */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

        {/* Protected App Routes (with MainLayout) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"      element={<DashboardPage />} />
          <Route path="/family"         element={<FamilyPage />} />
          <Route path="/indoor"         element={<IndoorPage />} />
          <Route path="/planner"        element={<PlannerPage />} />
          <Route path="/map"            element={<MapPage />} />
          <Route path="/chat"           element={<ChatPage />} />
          <Route path="/challenges"     element={<ChallengesPage />} />
          <Route path="/notifications"  element={<NotificationsPage />} />
          <Route path="/settings"       element={<SettingsPage />} />
          <Route path="/admin"          element={<AdminPage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

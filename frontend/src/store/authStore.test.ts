import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('useAuthStore (Zustand)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('initializes with logged-out state after logout()', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('updates state properly on setAuth', () => {
    const mockUser = {
      id: 42,
      email: 'aarav@saanssaathi.org',
      fullName: 'Aarav Patel',
      role: 'USER' as const,
      isVerified: true,
    }

    useAuthStore.getState().setAuth(mockUser, 'access-jwt-token-123', 'refresh-token-456')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe('aarav@saanssaathi.org')
    expect(state.token).toBe('access-jwt-token-123')
    expect(state.refreshToken).toBe('refresh-token-456')
  })

  it('clears credentials on logout', () => {
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})

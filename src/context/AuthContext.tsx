import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const AUTH_KEY = 'bhagyalaxmi-auth-v1'

export interface AuthUser {
  name: string
  email: string
  role: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  logout: () => void
}

const DEMO_USER: AuthUser = {
  name: 'Admin',
  email: 'admin@bhagyalaxmi.co.in',
  role: 'Full access',
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) return JSON.parse(raw) as AuthUser
  } catch {
    /* ignore */
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600))
    const e = email.trim().toLowerCase()
    const valid =
      (e === 'admin@bhagyalaxmi.co.in' || e === 'admin') &&
      password === 'admin123'

    if (!valid) {
      return 'Invalid email or password. Use admin@bhagyalaxmi.co.in / admin123'
    }

    setUser(DEMO_USER)
    localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER))
    return null
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import {
  ArrowRight,
  Boxes,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Package,
  ShieldCheck,
  Store,
  Warehouse,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80'

export function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/'

  const [email, setEmail] = useState('admin@bhagyalaxmi.co.in')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const message = await login(email, password)
    setLoading(false)
    if (message) {
      setError(message)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="login-page min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Visual entrance panel */}
      <section
        className={`relative hidden min-h-screen overflow-hidden bg-[#0f172a] transition-opacity duration-700 lg:flex lg:flex-col ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={HERO_IMAGE}
          alt="Premium bathroom showroom"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/95 via-[#0f172a]/85 to-[#1e3a8a]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.35),transparent_45%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/40">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Bhagyalaxmi</p>
              <p className="text-xs font-medium tracking-wide text-slate-300">
                Trading Corporation
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-200" />
              Secure admin access
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Command your bathroom equipment inventory with confidence.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-200">
              One powerful entrance to products, showrooms, sales teams, and
              distributors — built for Bhagyalaxmi Trading Corporation.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: Package, label: 'Products', value: '16+ SKUs' },
                { icon: Store, label: 'Showrooms', value: '3 shops' },
                { icon: Warehouse, label: 'Stock', value: 'Live control' },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                >
                  <Icon className="h-5 w-5 text-blue-200" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    {value}
                  </p>
                  <p className="text-xs text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Bhagyalaxmi Trading Corporation. All
            rights reserved.
          </p>
        </div>
      </section>

      {/* Login form */}
      <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 sm:px-8">
        <div
          className={`w-full max-w-md transition-all duration-700 ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563eb] text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Bhagyalaxmi</p>
              <p className="text-xs text-slate-500">Trading Corporation</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563eb]">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Sign in to Admin Portal
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Enter your credentials to manage inventory, shops, sales staff,
              and distributors.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
                    placeholder="admin@bhagyalaxmi.co.in"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                  />
                  Remember me
                </label>
                <span className="text-xs font-medium text-slate-400">
                  Demo access ready
                </span>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2563eb]/25 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in…' : 'Enter Admin Portal'}
                {!loading ? (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                ) : null}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-800">
                Demo credentials
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Email:{' '}
                <span className="font-medium text-slate-800">
                  admin@bhagyalaxmi.co.in
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Password:{' '}
                <span className="font-medium text-slate-800">admin123</span>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Protected inventory workspace for authorized staff only.
          </p>
        </div>
      </section>
    </div>
  )
}

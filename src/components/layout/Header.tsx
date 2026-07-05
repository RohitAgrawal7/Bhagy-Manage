import { LogOut, Menu, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export function Header({ onMenu }: { onMenu: () => void }) {
  const { resetData } = useApp()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials =
    user?.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AD'

  return (
    <div className="sticky top-0 z-30">
      <div className="h-1 w-full bg-ink-900" />
      <header className="flex items-center justify-between gap-4 border-b border-border bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="rounded-xl border border-border bg-white p-2 text-ink-700 shadow-sm transition hover:bg-brand-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm font-bold tracking-tight text-ink-900">
              Inventory Management
            </p>
            <p className="text-xs font-medium text-ink-400">
              Admin dashboard · Bathroom equipment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  'Reset all data to the original sample catalog? Your changes will be lost.',
                )
              ) {
                resetData()
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
            title="Reset to sample data"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset data</span>
          </button>
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white py-1.5 pl-3 pr-1.5 shadow-sm">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-ink-900">
                {user?.name ?? 'Admin'}
              </p>
              <p className="text-[11px] font-medium text-ink-400">
                {user?.role ?? 'Full access'}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
              {initials}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink-600 transition hover:bg-steel-50 hover:text-ink-900"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
    </div>
  )
}

import {
  Boxes,
  Building2,
  LayoutDashboard,
  Package,
  Store,
  Truck,
  Users,
  Warehouse,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/shops', label: 'Shops', icon: Store },
  { to: '/sales-persons', label: 'Sales Team', icon: Users },
  { to: '/distributors', label: 'Distributors', icon: Truck },
]

/** Sidebar keeps its own navy/blue look — not tied to page brand tokens */
export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0f172a] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/30">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-white">
                Bhagyalaxmi
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Trading Corp.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/25'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-[#3b82f6] text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-slate-300">
              <Building2 className="h-4 w-4 text-[#60a5fa]" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Admin Panel
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Bathroom equipment inventory, shops, sales team & distributors —
              full control.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

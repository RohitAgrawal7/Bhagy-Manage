import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: 'brand' | 'steel' | 'navy' | 'warn' | 'danger'
}

const tones = {
  brand: 'bg-brand-100 text-brand-700',
  steel: 'bg-steel-100 text-steel-700',
  navy: 'bg-ink-900 text-white',
  warn: 'bg-amber-50 text-warn-500',
  danger: 'bg-red-50 text-danger-600',
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
}: StatCardProps) {
  return (
    <div className="pro-card group p-5 transition duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">
            {value}
          </p>
          {hint ? (
            <p className="mt-1.5 text-xs font-medium text-ink-500">{hint}</p>
          ) : null}
        </div>
        <div
          className={`rounded-xl p-2.5 transition group-hover:scale-105 ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  )
}

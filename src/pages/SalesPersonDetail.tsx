import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate } from '../lib/utils'

export function SalesPersonDetail() {
  const { id } = useParams()
  const { salesPersons, shops, movements } = useApp()
  const person = salesPersons.find((sp) => sp.id === id)

  if (!person) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-ink-600">Sales person not found.</p>
        <Link to="/sales-persons" className="mt-3 inline-block text-brand-600">
          Back to sales team
        </Link>
      </div>
    )
  }

  const shop = shops.find((s) => s.id === person.shopId)
  const relatedMovements = movements.filter(
    (m) => m.performedBy === person.name,
  )
  const potentialCommission =
    (person.targetMonthly * person.commissionPercent) / 100

  return (
    <div>
      <Link
        to="/sales-persons"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sales team
      </Link>

      <PageHeader
        title={person.name}
        description={`${person.employeeCode} · ${person.role}`}
        actions={
          <Badge
            className={
              person.isActive
                ? 'bg-brand-100 text-brand-700'
                : 'bg-ink-100 text-ink-600'
            }
          >
            {person.isActive ? 'Active' : 'Inactive'}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-ink-900">
              Personal & contact details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Employee code', person.employeeCode],
                ['Role', person.role],
                ['Email', person.email],
                ['Phone', person.phone],
                ['Join date', formatDate(person.joinDate)],
                ['Address', person.address],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-ink-50/50 px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">
                Stock movements by this person
              </h2>
            </div>
            <div className="divide-y divide-border">
              {relatedMovements.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-500">
                  No stock movements recorded under this name yet.
                </p>
              ) : (
                relatedMovements.map((mov) => (
                  <div
                    key={mov.id}
                    className="flex justify-between px-5 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium capitalize text-ink-900">
                        {mov.type} · {mov.reference}
                      </p>
                      <p className="text-xs text-ink-500">{mov.notes}</p>
                    </div>
                    <p className="font-semibold">{mov.quantity}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Assigned showroom
            </p>
            {shop ? (
              <Link
                to={`/shops/${shop.id}`}
                className="mt-2 block font-semibold text-brand-600 hover:underline"
              >
                {shop.name}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-ink-500">Unassigned</p>
            )}
            {shop ? (
              <p className="mt-1 text-xs text-ink-500">
                {shop.city} · Manager: {shop.managerName}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Targets & commission
            </p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Monthly target</span>
                <span className="font-semibold">
                  {formatCurrency(person.targetMonthly)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Commission rate</span>
                <span className="font-semibold">
                  {person.commissionPercent}%
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-ink-500">At full target</span>
                <span className="font-semibold text-ink-900">
                  {formatCurrency(potentialCommission)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

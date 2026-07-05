import { ArrowLeft, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ProductIcon } from '../components/ui/ProductIcon'
import { PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate } from '../lib/utils'

export function DistributorDetail() {
  const { id } = useParams()
  const { distributors, products } = useApp()
  const distributor = distributors.find((d) => d.id === id)

  if (!distributor) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-ink-600">Distributor not found.</p>
        <Link to="/distributors" className="mt-3 inline-block text-brand-600">
          Back to distributors
        </Link>
      </div>
    )
  }

  const relatedProducts = products.filter((p) =>
    distributor.categories.includes(p.category),
  )

  return (
    <div>
      <Link
        to="/distributors"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to distributors
      </Link>

      <PageHeader
        title={distributor.companyName}
        description={`${distributor.code} · Partner since ${formatDate(distributor.since)}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: distributor.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <Badge
              className={
                distributor.isActive
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-ink-100 text-ink-600'
              }
            >
              {distributor.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-ink-900">
              Company & contact
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Contact person', distributor.contactPerson],
                ['Email', distributor.email],
                ['Phone', distributor.phone],
                ['GST number', distributor.gstNumber],
                ['Address', distributor.address],
                [
                  'Location',
                  `${distributor.city}, ${distributor.state} ${distributor.pincode}`,
                ],
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
                Catalog products in their categories
              </h2>
              <p className="text-xs text-ink-500">
                Products you stock that fall under this distributor&apos;s
                supply categories
              </p>
            </div>
            <div className="divide-y divide-border">
              {relatedProducts.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-500">
                  No matching products in catalog.
                </p>
              ) : (
                relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-ink-50"
                  >
                    <div className="flex items-center gap-2">
                      <ProductIcon product={p} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-ink-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink-500">
                          {p.sku} · {p.category} · {p.brand}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-ink-800">
                      {formatCurrency(p.costPrice)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Commercial terms
            </p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-500">Credit limit</span>
                <span className="font-semibold">
                  {formatCurrency(distributor.creditLimit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Payment terms</span>
                <span className="font-semibold">
                  {distributor.paymentTerms}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Rating</span>
                <span className="font-semibold">{distributor.rating} / 5</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Categories supplied
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {distributor.categories.map((c) => (
                <Badge key={c} className="bg-brand-100 text-brand-700">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

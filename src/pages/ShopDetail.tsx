import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ProductIcon } from '../components/ui/ProductIcon'
import { PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import {
  formatCurrency,
  formatDate,
  getAvailableQty,
  getStockStatus,
  stockStatusClass,
  stockStatusLabel,
} from '../lib/utils'

export function ShopDetail() {
  const { id } = useParams()
  const { shops, inventory, products, salesPersons, movements } = useApp()
  const shop = shops.find((s) => s.id === id)

  if (!shop) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-ink-600">Shop not found.</p>
        <Link to="/shops" className="mt-3 inline-block text-brand-600">
          Back to shops
        </Link>
      </div>
    )
  }

  const items = inventory
    .filter((i) => i.shopId === shop.id)
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { item, product } : null
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.product.name.localeCompare(b.product.name))

  const units = items.reduce((s, r) => s + r.item.quantity, 0)
  const value = items.reduce(
    (s, r) => s + r.product.costPrice * r.item.quantity,
    0,
  )
  const staff = salesPersons.filter((sp) => sp.shopId === shop.id)
  const shopMovements = movements
    .filter((m) => m.shopId === shop.id || m.toShopId === shop.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8)

  return (
    <div>
      <Link
        to="/shops"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shops
      </Link>

      <PageHeader
        title={shop.name}
        description={`${shop.code} · ${shop.city}, ${shop.state}`}
        actions={
          <Badge
            className={
              shop.isActive
                ? 'bg-brand-100 text-brand-700'
                : 'bg-ink-100 text-ink-600'
            }
          >
            {shop.isActive ? 'Active' : 'Inactive'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-ink-500">Stock units</p>
          <p className="text-2xl font-bold">{units}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-ink-500">Stock value</p>
          <p className="text-2xl font-bold">{formatCurrency(value)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-ink-500">Sales staff</p>
          <p className="text-2xl font-bold">{staff.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-ink-500">SKUs in stock</p>
          <p className="text-2xl font-bold">
            {items.filter((r) => r.item.quantity > 0).length}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink-900">Shop profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ['Address', shop.address],
              ['City', `${shop.city}, ${shop.state} ${shop.pincode}`],
              ['Phone', shop.phone],
              ['Email', shop.email],
              ['Manager', shop.managerName],
              ['Hours', shop.openingHours],
              ['Established', formatDate(shop.establishedDate)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {label}
                </dt>
                <dd className="mt-0.5 text-ink-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-ink-900">Sales team</h2>
          </div>
          <div className="divide-y divide-border">
            {staff.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-500">
                No sales persons assigned.
              </p>
            ) : (
              staff.map((sp) => (
                <Link
                  key={sp.id}
                  to={`/sales-persons/${sp.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-ink-50"
                >
                  <div>
                    <p className="font-medium text-ink-900">{sp.name}</p>
                    <p className="text-xs text-ink-500">
                      {sp.role} · {sp.employeeCode}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-ink-900">
                      {formatCurrency(sp.targetMonthly)}
                    </p>
                    <p className="text-xs text-ink-500">Monthly target</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">
            Inventory at this shop
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Reserved</th>
                <th className="px-4 py-3 font-semibold">Available</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(({ item, product }) => {
                const status = getStockStatus(
                  item.quantity,
                  product.minStockLevel,
                )
                return (
                  <tr key={item.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex items-center gap-2 font-medium text-ink-900 hover:text-brand-700"
                      >
                        <ProductIcon product={product} size="sm" />
                        {product.name}
                      </Link>
                      <p className="text-xs text-ink-500">{product.sku}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3">{item.reserved}</td>
                    <td className="px-4 py-3">{getAvailableQty(item)}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(product.costPrice * item.quantity)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={stockStatusClass(status)}>
                        {stockStatusLabel(status)}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">
            Recent movements
          </h2>
        </div>
        <div className="divide-y divide-border">
          {shopMovements.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-500">
              No movements for this shop yet.
            </p>
          ) : (
            shopMovements.map((mov) => {
              const product = products.find((p) => p.id === mov.productId)
              return (
                <div
                  key={mov.id}
                  className="flex justify-between gap-3 px-5 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium capitalize text-ink-900">
                      {mov.type} · {product?.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {mov.reference} · {mov.performedBy}
                    </p>
                  </div>
                  <p className="font-semibold">{mov.quantity}</p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

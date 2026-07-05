import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ProductIcon } from '../components/ui/ProductIcon'
import { PageHeader } from '../components/ui/PageHeader'
import { useApp } from '../context/AppContext'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getAvailableQty,
  getProductStockStatus,
  getProductTotalStock,
  getStockStatus,
  stockStatusClass,
  stockStatusLabel,
} from '../lib/utils'

export function ProductDetail() {
  const { id } = useParams()
  const { products, shops, inventory, movements } = useApp()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-ink-600">Product not found.</p>
        <Link to="/products" className="mt-3 inline-block text-brand-600">
          Back to products
        </Link>
      </div>
    )
  }

  const total = getProductTotalStock(product.id, inventory)
  const status = getProductStockStatus(product, inventory)
  const shopStock = shops.map((shop) => {
    const item = inventory.find(
      (i) => i.productId === product.id && i.shopId === shop.id,
    )
    return { shop, item }
  })
  const productMovements = movements
    .filter((m) => m.productId === product.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const margin =
    product.sellingPrice > 0
      ? ((product.sellingPrice - product.costPrice) / product.sellingPrice) *
        100
      : 0

  return (
    <div>
      <Link
        to="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <PageHeader
        title={product.name}
        description={`${product.sku} · ${product.brand} · ${product.category}`}
        actions={
          <Badge className={stockStatusClass(status)}>
            {stockStatusLabel(status)}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <ProductIcon product={product} size="lg" />
              <div>
                <h2 className="text-sm font-semibold text-ink-900">
                  Product details
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Material', product.material],
                ['Finish', product.finish],
                ['Dimensions', product.dimensions],
                ['Warranty', `${product.warrantyMonths} months`],
                ['Unit', product.unit],
                ['Status', product.isActive ? 'Active' : 'Inactive'],
                ['Created', formatDate(product.createdAt)],
                ['Updated', formatDate(product.updatedAt)],
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
                Stock by showroom
              </h2>
              <p className="text-xs text-ink-500">
                Live inventory across all 3 shops
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-ink-50 text-xs uppercase text-ink-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Shop</th>
                    <th className="px-5 py-3 font-semibold">Qty</th>
                    <th className="px-5 py-3 font-semibold">Reserved</th>
                    <th className="px-5 py-3 font-semibold">Available</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Last restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shopStock.map(({ shop, item }) => {
                    const qty = item?.quantity ?? 0
                    const reserved = item?.reserved ?? 0
                    const available = item ? getAvailableQty(item) : 0
                    const s = getStockStatus(qty, product.minStockLevel)
                    return (
                      <tr key={shop.id}>
                        <td className="px-5 py-3">
                          <Link
                            to={`/shops/${shop.id}`}
                            className="font-medium text-ink-900 hover:text-brand-700"
                          >
                            {shop.name}
                          </Link>
                          <p className="text-xs text-ink-500">{shop.city}</p>
                        </td>
                        <td className="px-5 py-3 font-semibold">{qty}</td>
                        <td className="px-5 py-3 text-ink-600">{reserved}</td>
                        <td className="px-5 py-3 text-ink-600">{available}</td>
                        <td className="px-5 py-3">
                          <Badge className={stockStatusClass(s)}>
                            {stockStatusLabel(s)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-ink-500">
                          {item ? formatDate(item.lastRestockedAt) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-ink-900">
                Movement history
              </h2>
            </div>
            <div className="divide-y divide-border">
              {productMovements.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink-500">
                  No movements recorded for this product.
                </p>
              ) : (
                productMovements.map((mov) => {
                  const shop = shops.find((s) => s.id === mov.shopId)
                  const toShop = shops.find((s) => s.id === mov.toShopId)
                  return (
                    <div
                      key={mov.id}
                      className="flex flex-wrap items-start justify-between gap-3 px-5 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium capitalize text-ink-900">
                          {mov.type}
                          {toShop ? ` → ${toShop.city}` : ''}
                        </p>
                        <p className="text-xs text-ink-500">
                          {shop?.city} · {mov.reference} · {mov.performedBy}
                        </p>
                        {mov.notes ? (
                          <p className="mt-1 text-xs text-ink-400">
                            {mov.notes}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink-900">
                          {mov.quantity > 0 && mov.type !== 'out' && mov.type !== 'transfer'
                            ? '+'
                            : mov.type === 'out' || mov.type === 'transfer'
                              ? '-'
                              : ''}
                          {Math.abs(mov.quantity)}
                        </p>
                        <p className="text-[11px] text-ink-400">
                          {formatDateTime(mov.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Total stock
            </p>
            <p className="mt-1 text-3xl font-bold text-ink-950">
              {total}{' '}
              <span className="text-base font-medium text-ink-400">
                {product.unit}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Minimum level: {product.minStockLevel}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Pricing
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Cost</span>
                <span className="font-medium">
                  {formatCurrency(product.costPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Selling</span>
                <span className="font-semibold text-ink-900">
                  {formatCurrency(product.sellingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Margin</span>
                <span className="font-medium text-ink-900">
                  {margin.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm">
                <span className="text-ink-500">Stock value</span>
                <span className="font-semibold">
                  {formatCurrency(product.costPrice * total)}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/inventory"
            className="block rounded-2xl bg-ink-900 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800"
          >
            Adjust stock in Inventory
          </Link>
        </div>
      </div>
    </div>
  )
}

import { ArrowLeftRight, PackageMinus, PackagePlus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ProductIcon } from '../components/ui/ProductIcon'
import {
  Field,
  FormActions,
  Input,
  Select,
  Textarea,
} from '../components/ui/FormField'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { useApp } from '../context/AppContext'
import {
  formatCurrency,
  formatDateTime,
  getAvailableQty,
  getStockStatus,
  stockStatusClass,
  stockStatusLabel,
} from '../lib/utils'
import type { MovementType } from '../types'

type ModalMode = 'in' | 'out' | 'transfer' | 'adjustment' | null

export function Inventory() {
  const { products, shops, inventory, movements, adjustStock } = useApp()
  const [shopFilter, setShopFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'stock' | 'movements'>('stock')
  const [mode, setMode] = useState<ModalMode>(null)
  const [form, setForm] = useState({
    productId: '',
    shopId: '',
    toShopId: '',
    quantity: 1,
    reference: '',
    notes: '',
    performedBy: 'Admin',
  })

  const rows = useMemo(() => {
    return inventory
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        const shop = shops.find((s) => s.id === item.shopId)
        if (!product || !shop) return null
        const status = getStockStatus(item.quantity, product.minStockLevel)
        return { item, product, shop, status }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .filter((r) => {
        const q = query.toLowerCase()
        const matchQ =
          !q ||
          r.product.name.toLowerCase().includes(q) ||
          r.product.sku.toLowerCase().includes(q)
        const matchShop = shopFilter === 'all' || r.shop.id === shopFilter
        const matchStatus = statusFilter === 'all' || r.status === statusFilter
        return matchQ && matchShop && matchStatus
      })
      .sort((a, b) => a.product.name.localeCompare(b.product.name))
  }, [inventory, products, shops, query, shopFilter, statusFilter])

  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0)
  const totalValue = inventory.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product ? product.costPrice * item.quantity : 0)
  }, 0)
  const lowCount = inventory.filter((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return false
    return getStockStatus(item.quantity, product.minStockLevel) !== 'in_stock'
  }).length

  function openModal(m: ModalMode) {
    setMode(m)
    setForm({
      productId: products[0]?.id ?? '',
      shopId: shops[0]?.id ?? '',
      toShopId: shops[1]?.id ?? '',
      quantity: 1,
      reference: '',
      notes: '',
      performedBy: 'Admin',
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mode) return
    adjustStock({
      productId: form.productId,
      shopId: form.shopId,
      type: mode as MovementType,
      quantity:
        mode === 'adjustment' && form.quantity < 0
          ? form.quantity
          : Math.abs(form.quantity),
      toShopId: mode === 'transfer' ? form.toShopId : undefined,
      reference: form.reference || `${mode.toUpperCase()}-${Date.now()}`,
      notes: form.notes,
      performedBy: form.performedBy,
    })
    setMode(null)
  }

  const modalTitle =
    mode === 'in'
      ? 'Stock In (Receive)'
      : mode === 'out'
        ? 'Stock Out (Sale / Issue)'
        : mode === 'transfer'
          ? 'Transfer Between Shops'
          : 'Stock Adjustment'

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Control stock across all showrooms — receive, issue, transfer, and adjust with full movement history."
        actions={
          <>
            <button
              type="button"
              onClick={() => openModal('in')}
              className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink-800"
            >
              <PackagePlus className="h-4 w-4" />
              Stock In
            </button>
            <button
              type="button"
              onClick={() => openModal('out')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              <PackageMinus className="h-4 w-4" />
              Stock Out
            </button>
            <button
              type="button"
              onClick={() => openModal('transfer')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Transfer
            </button>
            <button
              type="button"
              onClick={() => openModal('adjustment')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              Adjust
            </button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Units"
          value={totalUnits.toLocaleString('en-IN')}
          icon={PackagePlus}
        />
        <StatCard
          label="Inventory Value"
          value={formatCurrency(totalValue)}
          icon={PackageMinus}
          tone="steel"
        />
        <StatCard
          label="Alert Lines"
          value={lowCount}
          hint="Low or out of stock rows"
          icon={ArrowLeftRight}
          tone={lowCount > 0 ? 'danger' : 'brand'}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('stock')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === 'stock'
              ? 'bg-ink-900 text-white shadow-sm'
              : 'border border-border bg-white text-ink-600'
          }`}
        >
          Stock levels
        </button>
        <button
          type="button"
          onClick={() => setTab('movements')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            tab === 'movements'
              ? 'bg-ink-900 text-white shadow-sm'
              : 'border border-border bg-white text-ink-600'
          }`}
        >
          Movement log
        </button>
      </div>

      {tab === 'stock' ? (
        <>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product or SKU…"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <select
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            >
              <option value="all">All shops</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city} — {s.code}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>

          <div className="pro-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Shop</th>
                    <th className="px-4 py-3 font-semibold">Qty</th>
                    <th className="px-4 py-3 font-semibold">Reserved</th>
                    <th className="px-4 py-3 font-semibold">Available</th>
                    <th className="px-4 py-3 font-semibold">Min</th>
                    <th className="px-4 py-3 font-semibold">Value</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map(({ item, product, shop, status }) => (
                    <tr key={item.id} className="hover:bg-ink-50/60">
                      <td className="px-4 py-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="flex items-center gap-2"
                        >
                          <ProductIcon product={product} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900 hover:text-brand-700">
                              {product.name}
                            </p>
                            <p className="text-xs text-ink-500">
                              {product.sku}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/shops/${shop.id}`}
                          className="text-ink-700 hover:text-brand-700"
                        >
                          {shop.city}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-ink-600">
                        {item.reserved}
                      </td>
                      <td className="px-4 py-3 text-ink-600">
                        {getAvailableQty(item)}
                      </td>
                      <td className="px-4 py-3 text-ink-500">
                        {product.minStockLevel}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {formatCurrency(product.costPrice * item.quantity)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={stockStatusClass(status)}>
                          {stockStatusLabel(status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-ink-500">
                No inventory rows match your filters.
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="pro-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Shop</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">By</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...movements]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((mov) => {
                    const product = products.find((p) => p.id === mov.productId)
                    const shop = shops.find((s) => s.id === mov.shopId)
                    const toShop = shops.find((s) => s.id === mov.toShopId)
                    return (
                      <tr key={mov.id} className="hover:bg-ink-50/60">
                        <td className="px-4 py-3 text-ink-600 whitespace-nowrap">
                          {formatDateTime(mov.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className="bg-ink-100 text-ink-700 capitalize">
                            {mov.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-ink-900">
                          {product?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-ink-600">
                          {shop?.city}
                          {toShop ? ` → ${toShop.city}` : ''}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {mov.quantity}
                        </td>
                        <td className="px-4 py-3 text-ink-600">
                          {mov.reference}
                        </td>
                        <td className="px-4 py-3 text-ink-600">
                          {mov.performedBy}
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-ink-500">
                          {mov.notes || '—'}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={mode !== null}
        onClose={() => setMode(null)}
        title={modalTitle}
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Product" required>
            <Select
              required
              value={form.productId}
              onChange={(e) =>
                setForm({ ...form, productId: e.target.value })
              }
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label={mode === 'transfer' ? 'From shop' : 'Shop'}
            required
          >
            <Select
              required
              value={form.shopId}
              onChange={(e) => setForm({ ...form, shopId: e.target.value })}
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          {mode === 'transfer' ? (
            <Field label="To shop" required>
              <Select
                required
                value={form.toShopId}
                onChange={(e) =>
                  setForm({ ...form, toShopId: e.target.value })
                }
              >
                {shops
                  .filter((s) => s.id !== form.shopId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </Select>
            </Field>
          ) : null}
          <Field
            label={
              mode === 'adjustment'
                ? 'Quantity (+ add / − remove)'
                : 'Quantity'
            }
            required
          >
            <Input
              type="number"
              required
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              min={mode === 'adjustment' ? undefined : 1}
            />
          </Field>
          <Field label="Reference">
            <Input
              value={form.reference}
              onChange={(e) =>
                setForm({ ...form, reference: e.target.value })
              }
              placeholder="PO / Invoice / Transfer no."
            />
          </Field>
          <Field label="Performed by">
            <Input
              value={form.performedBy}
              onChange={(e) =>
                setForm({ ...form, performedBy: e.target.value })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <FormActions
              onCancel={() => setMode(null)}
              submitLabel="Confirm movement"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

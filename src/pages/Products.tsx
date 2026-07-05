import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
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
import { useApp } from '../context/AppContext'
import {
  PRODUCT_CATEGORIES,
  formatCurrency,
  getProductStockStatus,
  getProductTotalStock,
  stockStatusClass,
  stockStatusLabel,
} from '../lib/utils'
import type { Product, ProductCategory } from '../types'

const emptyForm = {
  sku: '',
  name: '',
  category: 'Faucets & Mixers' as ProductCategory,
  brand: '',
  description: '',
  material: '',
  finish: '',
  dimensions: '',
  warrantyMonths: 12,
  costPrice: 0,
  sellingPrice: 0,
  minStockLevel: 5,
  unit: 'pcs',
  imageEmoji: '📦',
  isActive: true,
}

export function Products() {
  const { products, inventory, addProduct, updateProduct, deleteProduct } =
    useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.toLowerCase()
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      const matchC = category === 'all' || p.category === category
      return matchQ && matchC
    })
  }, [products, query, category])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description,
      material: product.material,
      finish: product.finish,
      dimensions: product.dimensions,
      warrantyMonths: product.warrantyMonths,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      minStockLevel: product.minStockLevel,
      unit: product.unit,
      imageEmoji: product.imageEmoji,
      isActive: product.isActive,
    })
    setOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      updateProduct(editing.id, form)
    } else {
      addProduct(form)
    }
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Full bathroom equipment catalog — faucets, showers, closets, basins, heaters and more."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink-800"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, or brand…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-50/80 text-xs font-semibold uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Brand</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
                <th className="px-4 py-3 font-semibold">Sell</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const total = getProductTotalStock(product.id, inventory)
                const status = getProductStockStatus(product, inventory)
                return (
                  <tr key={product.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex items-center gap-3"
                      >
                        <ProductIcon product={product} size="sm" />
                        <div>
                          <p className="font-medium text-ink-900 hover:text-brand-700">
                            {product.name}
                          </p>
                          <p className="text-xs text-ink-500">{product.sku}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{product.category}</td>
                    <td className="px-4 py-3 text-ink-600">{product.brand}</td>
                    <td className="px-4 py-3 text-ink-700">
                      {formatCurrency(product.costPrice)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {formatCurrency(product.sellingPrice)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink-900">
                      {total}{' '}
                      <span className="text-xs font-normal text-ink-400">
                        {product.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={stockStatusClass(status)}>
                        {stockStatusLabel(status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete ${product.name}?`)) {
                              deleteProduct(product.id)
                            }
                          }}
                          className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-500">
            No products match your filters.
          </p>
        ) : null}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="SKU" required>
            <Input
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </Field>
          <Field label="Name" required>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as ProductCategory,
                })
              }
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Brand" required>
            <Input
              required
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" required>
              <Textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Material">
            <Input
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />
          </Field>
          <Field label="Finish">
            <Input
              value={form.finish}
              onChange={(e) => setForm({ ...form, finish: e.target.value })}
            />
          </Field>
          <Field label="Dimensions">
            <Input
              value={form.dimensions}
              onChange={(e) =>
                setForm({ ...form, dimensions: e.target.value })
              }
            />
          </Field>
          <Field label="Warranty (months)">
            <Input
              type="number"
              min={0}
              value={form.warrantyMonths}
              onChange={(e) =>
                setForm({
                  ...form,
                  warrantyMonths: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Cost Price (₹)" required>
            <Input
              type="number"
              min={0}
              required
              value={form.costPrice}
              onChange={(e) =>
                setForm({ ...form, costPrice: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Selling Price (₹)" required>
            <Input
              type="number"
              min={0}
              required
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Min Stock Level">
            <Input
              type="number"
              min={0}
              value={form.minStockLevel}
              onChange={(e) =>
                setForm({
                  ...form,
                  minStockLevel: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Unit">
            <Input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </Field>
          <Field label="Category icon">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-ink-50 px-3 py-2.5">
              <ProductIcon category={form.category} size="sm" />
              <span className="text-sm font-medium text-ink-600">
                Auto icon for {form.category}
              </span>
            </div>
          </Field>
          <Field label="Status">
            <Select
              value={form.isActive ? 'active' : 'inactive'}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === 'active' })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <FormActions
              onCancel={() => setOpen(false)}
              submitLabel={editing ? 'Update Product' : 'Create Product'}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

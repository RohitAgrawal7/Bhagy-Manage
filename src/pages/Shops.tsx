import { Pencil, Plus, Store, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
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
import { formatCurrency, formatDate } from '../lib/utils'
import type { Shop } from '../types'

const emptyForm = {
  code: '',
  name: '',
  address: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  phone: '',
  email: '',
  managerName: '',
  openingHours: 'Mon–Sat 10:00 AM – 8:00 PM',
  isActive: true,
  establishedDate: new Date().toISOString().slice(0, 10),
}

export function Shops() {
  const {
    shops,
    inventory,
    products,
    salesPersons,
    addShop,
    updateShop,
    deleteShop,
  } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Shop | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(shop: Shop) {
    setEditing(shop)
    setForm({
      code: shop.code,
      name: shop.name,
      address: shop.address,
      city: shop.city,
      state: shop.state,
      pincode: shop.pincode,
      phone: shop.phone,
      email: shop.email,
      managerName: shop.managerName,
      openingHours: shop.openingHours,
      isActive: shop.isActive,
      establishedDate: shop.establishedDate,
    })
    setOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) updateShop(editing.id, form)
    else addShop(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Showrooms"
        description="Bhagyalaxmi operates 3 bathroom equipment showrooms. Manage shop details, managers, and linked inventory."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink-800"
          >
            <Plus className="h-4 w-4" />
            Add Shop
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {shops.map((shop) => {
          const items = inventory.filter((i) => i.shopId === shop.id)
          const units = items.reduce((s, i) => s + i.quantity, 0)
          const value = items.reduce((sum, item) => {
            const product = products.find((p) => p.id === item.productId)
            return sum + (product ? product.costPrice * item.quantity : 0)
          }, 0)
          const staff = salesPersons.filter((sp) => sp.shopId === shop.id)
          const low = items.filter((item) => {
            const product = products.find((p) => p.id === item.productId)
            return product && item.quantity <= product.minStockLevel
          }).length

          return (
            <div
              key={shop.id}
              className="flex flex-col rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {shop.code}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-ink-900">
                      {shop.name}
                    </h2>
                    <p className="mt-1 text-sm text-ink-500">
                      {shop.address}
                    </p>
                    <p className="text-sm text-ink-500">
                      {shop.city}, {shop.state} {shop.pincode}
                    </p>
                  </div>
                  <div className="rounded-xl bg-brand-100 p-2 text-brand-700">
                    <Store className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    className={
                      shop.isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-ink-100 text-ink-600'
                    }
                  >
                    {shop.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge className="bg-ink-100 text-ink-600">
                    Est. {formatDate(shop.establishedDate)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Stock units</p>
                  <p className="text-xl font-bold text-ink-900">{units}</p>
                </div>
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Stock value</p>
                  <p className="text-lg font-bold text-ink-900">
                    {formatCurrency(value)}
                  </p>
                </div>
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Sales staff</p>
                  <p className="text-xl font-bold text-ink-900">
                    {staff.length}
                  </p>
                </div>
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Alerts</p>
                  <p className="text-xl font-bold text-ink-900">{low}</p>
                </div>
              </div>

              <div className="space-y-1 border-t border-border px-5 py-4 text-sm text-ink-600">
                <p>
                  <span className="text-ink-400">Manager:</span>{' '}
                  {shop.managerName}
                </p>
                <p>
                  <span className="text-ink-400">Phone:</span> {shop.phone}
                </p>
                <p>
                  <span className="text-ink-400">Email:</span> {shop.email}
                </p>
                <p>
                  <span className="text-ink-400">Hours:</span>{' '}
                  {shop.openingHours}
                </p>
              </div>

              <div className="mt-auto flex gap-2 border-t border-border p-4">
                <Link
                  to={`/shops/${shop.id}`}
                  className="flex-1 rounded-xl bg-ink-900 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-ink-800"
                >
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => openEdit(shop)}
                  className="rounded-xl border border-border p-2.5 text-ink-600 hover:bg-ink-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Delete ${shop.name}? Inventory and staff links will be removed.`,
                      )
                    ) {
                      deleteShop(shop.id)
                    }
                  }}
                  className="rounded-xl border border-border p-2.5 text-ink-600 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Shop' : 'Add Shop'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Shop code" required>
            <Input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Field>
          <Field label="Shop name" required>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" required>
              <Textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
          </div>
          <Field label="City" required>
            <Input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <Field label="State" required>
            <Input
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </Field>
          <Field label="Pincode" required>
            <Input
              required
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </Field>
          <Field label="Phone" required>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Email" required>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Manager name" required>
            <Input
              required
              value={form.managerName}
              onChange={(e) =>
                setForm({ ...form, managerName: e.target.value })
              }
            />
          </Field>
          <Field label="Opening hours">
            <Input
              value={form.openingHours}
              onChange={(e) =>
                setForm({ ...form, openingHours: e.target.value })
              }
            />
          </Field>
          <Field label="Established date">
            <Input
              type="date"
              value={form.establishedDate}
              onChange={(e) =>
                setForm({ ...form, establishedDate: e.target.value })
              }
            />
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
              submitLabel={editing ? 'Update Shop' : 'Create Shop'}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

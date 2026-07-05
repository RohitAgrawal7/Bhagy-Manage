import { Pencil, Plus, Star, Trash2, Truck } from 'lucide-react'
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
import { PRODUCT_CATEGORIES, formatCurrency, formatDate } from '../lib/utils'
import type { Distributor, ProductCategory } from '../types'

const emptyForm = {
  code: '',
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstNumber: '',
  categories: [] as ProductCategory[],
  paymentTerms: 'Net 30 days',
  creditLimit: 500000,
  rating: 4,
  isActive: true,
  since: new Date().toISOString().slice(0, 10),
}

export function Distributors() {
  const {
    distributors,
    addDistributor,
    updateDistributor,
    deleteDistributor,
  } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Distributor | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(d: Distributor) {
    setEditing(d)
    setForm({
      code: d.code,
      companyName: d.companyName,
      contactPerson: d.contactPerson,
      email: d.email,
      phone: d.phone,
      address: d.address,
      city: d.city,
      state: d.state,
      pincode: d.pincode,
      gstNumber: d.gstNumber,
      categories: [...d.categories],
      paymentTerms: d.paymentTerms,
      creditLimit: d.creditLimit,
      rating: d.rating,
      isActive: d.isActive,
      since: d.since,
    })
    setOpen(true)
  }

  function toggleCategory(cat: ProductCategory) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) updateDistributor(editing.id, form)
    else addDistributor(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Distributors"
        description="Supply partners for bathroom equipment — contact, GST, categories, credit limits, and payment terms."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink-800"
          >
            <Plus className="h-4 w-4" />
            Add Distributor
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {distributors.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-brand-100 p-2.5 text-brand-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <Link
                    to={`/distributors/${d.id}`}
                    className="text-lg font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {d.companyName}
                  </Link>
                  <p className="text-xs text-ink-500">{d.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: d.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-ink-600 sm:grid-cols-2">
              <p>
                <span className="text-ink-400">Contact:</span>{' '}
                {d.contactPerson}
              </p>
              <p>
                <span className="text-ink-400">Phone:</span> {d.phone}
              </p>
              <p>
                <span className="text-ink-400">Email:</span> {d.email}
              </p>
              <p>
                <span className="text-ink-400">GST:</span> {d.gstNumber}
              </p>
              <p>
                <span className="text-ink-400">Location:</span> {d.city},{' '}
                {d.state}
              </p>
              <p>
                <span className="text-ink-400">Since:</span>{' '}
                {formatDate(d.since)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.categories.map((c) => (
                <Badge key={c} className="bg-brand-100 text-brand-700">
                  {c}
                </Badge>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-ink-50 px-3 py-2">
                <p className="text-[11px] text-ink-500">Credit limit</p>
                <p className="text-sm font-bold">
                  {formatCurrency(d.creditLimit)}
                </p>
              </div>
              <div className="rounded-xl bg-ink-50 px-3 py-2">
                <p className="text-[11px] text-ink-500">Payment terms</p>
                <p className="text-sm font-bold">{d.paymentTerms}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/distributors/${d.id}`}
                className="flex-1 rounded-xl border border-border py-2 text-center text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                Full details
              </Link>
              <button
                type="button"
                onClick={() => openEdit(d)}
                className="rounded-xl border border-border p-2 text-ink-600 hover:bg-ink-50"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove distributor ${d.companyName}?`)) {
                    deleteDistributor(d.id)
                  }
                }}
                className="rounded-xl border border-border p-2 text-ink-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Distributor' : 'Add Distributor'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Distributor code" required>
            <Input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Field>
          <Field label="Company name" required>
            <Input
              required
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
          </Field>
          <Field label="Contact person" required>
            <Input
              required
              value={form.contactPerson}
              onChange={(e) =>
                setForm({ ...form, contactPerson: e.target.value })
              }
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
          <Field label="Phone" required>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="GST number" required>
            <Input
              required
              value={form.gstNumber}
              onChange={(e) =>
                setForm({ ...form, gstNumber: e.target.value })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" required>
              <Textarea
                required
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
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
          <Field label="Pincode">
            <Input
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </Field>
          <Field label="Payment terms">
            <Input
              value={form.paymentTerms}
              onChange={(e) =>
                setForm({ ...form, paymentTerms: e.target.value })
              }
            />
          </Field>
          <Field label="Credit limit (₹)">
            <Input
              type="number"
              min={0}
              value={form.creditLimit}
              onChange={(e) =>
                setForm({ ...form, creditLimit: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Rating (1–5)">
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Partner since">
            <Input
              type="date"
              value={form.since}
              onChange={(e) => setForm({ ...form, since: e.target.value })}
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
            <p className="mb-2 text-sm font-medium text-ink-700">
              Product categories supplied
            </p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => {
                const active = form.categories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="sm:col-span-2">
            <FormActions
              onCancel={() => setOpen(false)}
              submitLabel={editing ? 'Update' : 'Create'}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

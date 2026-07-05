import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
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
import { SALES_ROLES, formatCurrency, formatDate } from '../lib/utils'
import type { SalesPerson } from '../types'

const emptyForm = {
  employeeCode: '',
  name: '',
  email: '',
  phone: '',
  shopId: '',
  role: 'Sales Executive' as SalesPerson['role'],
  joinDate: new Date().toISOString().slice(0, 10),
  targetMonthly: 400000,
  commissionPercent: 2,
  address: '',
  isActive: true,
}

export function SalesPersons() {
  const {
    salesPersons,
    shops,
    addSalesPerson,
    updateSalesPerson,
    deleteSalesPerson,
  } = useApp()
  const [shopFilter, setShopFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SalesPerson | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(
    () =>
      salesPersons.filter(
        (sp) => shopFilter === 'all' || sp.shopId === shopFilter,
      ),
    [salesPersons, shopFilter],
  )

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, shopId: shops[0]?.id ?? '' })
    setOpen(true)
  }

  function openEdit(person: SalesPerson) {
    setEditing(person)
    setForm({
      employeeCode: person.employeeCode,
      name: person.name,
      email: person.email,
      phone: person.phone,
      shopId: person.shopId,
      role: person.role,
      joinDate: person.joinDate,
      targetMonthly: person.targetMonthly,
      commissionPercent: person.commissionPercent,
      address: person.address,
      isActive: person.isActive,
    })
    setOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) updateSalesPerson(editing.id, form)
    else addSalesPerson(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Sales Team"
        description="Sales persons assigned to each showroom — roles, targets, commission, and contact details."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ink-800"
          >
            <Plus className="h-4 w-4" />
            Add Sales Person
          </button>
        }
      />

      <div className="mb-4">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sp) => {
          const shop = shops.find((s) => s.id === sp.shopId)
          return (
            <div
              key={sp.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-ink-900">
                    {sp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <Link
                      to={`/sales-persons/${sp.id}`}
                      className="font-semibold text-ink-900 hover:text-brand-700"
                    >
                      {sp.name}
                    </Link>
                    <p className="text-xs text-ink-500">{sp.employeeCode}</p>
                  </div>
                </div>
                <Badge
                  className={
                    sp.isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-ink-100 text-ink-600'
                  }
                >
                  {sp.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <p>
                  <span className="text-ink-400">Role:</span> {sp.role}
                </p>
                <p>
                  <span className="text-ink-400">Shop:</span>{' '}
                  {shop ? (
                    <Link
                      to={`/shops/${shop.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      {shop.name}
                    </Link>
                  ) : (
                    '—'
                  )}
                </p>
                <p>
                  <span className="text-ink-400">Phone:</span> {sp.phone}
                </p>
                <p>
                  <span className="text-ink-400">Email:</span> {sp.email}
                </p>
                <p>
                  <span className="text-ink-400">Joined:</span>{' '}
                  {formatDate(sp.joinDate)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Monthly target</p>
                  <p className="text-sm font-bold text-ink-900">
                    {formatCurrency(sp.targetMonthly)}
                  </p>
                </div>
                <div className="rounded-xl bg-ink-50 px-3 py-2">
                  <p className="text-[11px] text-ink-500">Commission</p>
                  <p className="text-sm font-bold text-ink-900">
                    {sp.commissionPercent}%
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/sales-persons/${sp.id}`}
                  className="flex-1 rounded-xl border border-border py-2 text-center text-sm font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Details
                </Link>
                <button
                  type="button"
                  onClick={() => openEdit(sp)}
                  className="rounded-xl border border-border p-2 text-ink-600 hover:bg-ink-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${sp.name} from sales team?`)) {
                      deleteSalesPerson(sp.id)
                    }
                  }}
                  className="rounded-xl border border-border p-2 text-ink-600 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card py-12 text-center">
          <Users className="mx-auto h-8 w-8 text-ink-300" />
          <p className="mt-2 text-sm text-ink-500">No sales persons found.</p>
        </div>
      ) : null}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Sales Person' : 'Add Sales Person'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Employee code" required>
            <Input
              required
              value={form.employeeCode}
              onChange={(e) =>
                setForm({ ...form, employeeCode: e.target.value })
              }
            />
          </Field>
          <Field label="Full name" required>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <Field label="Assigned shop" required>
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
          <Field label="Role" required>
            <Select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as SalesPerson['role'],
                })
              }
            >
              {SALES_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Join date">
            <Input
              type="date"
              value={form.joinDate}
              onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
            />
          </Field>
          <Field label="Monthly target (₹)">
            <Input
              type="number"
              min={0}
              value={form.targetMonthly}
              onChange={(e) =>
                setForm({
                  ...form,
                  targetMonthly: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Commission %">
            <Input
              type="number"
              min={0}
              step={0.1}
              value={form.commissionPercent}
              onChange={(e) =>
                setForm({
                  ...form,
                  commissionPercent: Number(e.target.value),
                })
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
            <Field label="Address">
              <Textarea
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </Field>
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

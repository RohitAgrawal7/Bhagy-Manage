import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Package,
  Store,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/ui/PageHeader'
import { ProductIcon } from '../components/ui/ProductIcon'
import { StatCard } from '../components/ui/StatCard'
import { useApp } from '../context/AppContext'
import {
  formatCurrency,
  formatDateTime,
  getProductStockStatus,
  getProductTotalStock,
  stockStatusClass,
  stockStatusLabel,
} from '../lib/utils'

const MOVEMENT_COLORS: Record<string, string> = {
  in: '#a67c52',
  out: '#dc2626',
  transfer: '#475569',
  adjustment: '#64748b',
}

/** Navy · Bronze · Steel · Sand */
const DONUT_COLORS = [
  '#0f172a',
  '#a67c52',
  '#475569',
  '#d4b48f',
  '#334155',
  '#c09264',
  '#64748b',
  '#8b6914',
  '#1e293b',
]

export function Dashboard() {
  const { products, shops, inventory, salesPersons, distributors, movements } =
    useApp()

  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0)
  const inventoryValue = inventory.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product ? product.costPrice * item.quantity : 0)
  }, 0)

  const lowStockProducts = products.filter((p) => {
    const status = getProductStockStatus(p, inventory)
    return status === 'low_stock' || status === 'out_of_stock'
  })

  const shopStock = shops.map((shop) => {
    const items = inventory.filter((i) => i.shopId === shop.id)
    const units = items.reduce((s, i) => s + i.quantity, 0)
    const value = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      return sum + (product ? product.costPrice * item.quantity : 0)
    }, 0)
    return { name: shop.city, units, value }
  })

  const categoryMap = new Map<string, number>()
  for (const product of products) {
    const total = getProductTotalStock(product.id, inventory)
    categoryMap.set(
      product.category,
      (categoryMap.get(product.category) ?? 0) + total,
    )
  }
  const categoryData = [...categoryMap.entries()]
    .map(([name, units]) => ({
      name: name.split(' ')[0],
      fullName: name,
      units,
    }))
    .sort((a, b) => b.units - a.units)

  const recentMovements = [...movements]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6)

  const activeSkus = products.filter((p) => p.isActive).length

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Live overview of bathroom equipment inventory, showrooms, sales staff, and distributors across Bhagyalaxmi Trading Corporation."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={products.length}
          hint={`${activeSkus} active SKUs in catalog`}
          icon={Package}
          tone="brand"
        />
        <StatCard
          label="Stock Units"
          value={totalUnits.toLocaleString('en-IN')}
          hint={`Inventory value ${formatCurrency(inventoryValue)}`}
          icon={Warehouse}
          tone="navy"
        />
        <StatCard
          label="Showrooms"
          value={shops.length}
          hint={`${salesPersons.length} sales staff assigned`}
          icon={Store}
          tone="steel"
        />
        <StatCard
          label="Stock Alerts"
          value={lowStockProducts.length}
          hint="Low or out of stock items"
          icon={AlertTriangle}
          tone="warn"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            to: '/products',
            label: 'Manage Products',
            hint: 'Catalog, pricing & specs',
            icon: Package,
            tone: 'brand' as const,
          },
          {
            to: '/inventory',
            label: 'Stock Control',
            hint: 'In / out / transfer / adjust',
            icon: Warehouse,
            tone: 'navy' as const,
          },
          {
            to: '/sales-persons',
            label: 'Sales Team',
            hint: 'Staff, targets & commission',
            icon: Users,
            tone: 'steel' as const,
          },
          {
            to: '/distributors',
            label: 'Distributors',
            hint: 'Suppliers, GST & terms',
            icon: Truck,
            tone: 'brand' as const,
          },
        ].map(({ to, label, hint, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="pro-card flex items-center gap-3.5 p-4 transition duration-200 hover:-translate-y-0.5"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                tone === 'navy'
                  ? 'bg-ink-900 text-white'
                  : tone === 'steel'
                    ? 'bg-steel-100 text-steel-700'
                    : 'bg-brand-100 text-brand-700'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">{label}</p>
              <p className="text-xs font-medium text-ink-500">{hint}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-5">
        <div className="pro-card p-5 xl:col-span-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-ink-900">
                Stock by Showroom
              </h2>
              <p className="mt-0.5 text-xs font-medium text-ink-500">
                Units held at each of the 3 shops
              </p>
            </div>
            <Badge className="bg-brand-100 text-brand-700">Live</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopStock}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e4de" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip
                  formatter={(value) => [
                    Number(value).toLocaleString('en-IN'),
                    'Units',
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8e4de',
                    fontSize: 12,
                    boxShadow: '0 8px 20px rgb(15 23 42 / 0.08)',
                  }}
                />
                <Bar dataKey="units" fill="#a67c52" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pro-card p-5 xl:col-span-2">
          <div className="mb-1">
            <h2 className="text-sm font-bold text-ink-900">
              Units by Category
            </h2>
            <p className="mt-0.5 text-xs font-medium text-ink-500">
              Across all showrooms
            </p>
          </div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="units"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _n, item) => [
                    Number(value).toLocaleString('en-IN'),
                    (item?.payload as { fullName?: string })?.fullName ?? '',
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8e4de',
                    fontSize: 12,
                    boxShadow: '0 8px 20px rgb(15 23 42 / 0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="pro-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-ink-900">Stock Alerts</h2>
              <p className="text-xs font-medium text-ink-500">
                Products below minimum level
              </p>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              View inventory
            </Link>
          </div>
          <div className="divide-y divide-border">
            {lowStockProducts.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm font-medium text-ink-500">
                All products are above minimum stock levels.
              </p>
            ) : (
              lowStockProducts.slice(0, 6).map((product) => {
                const total = getProductTotalStock(product.id, inventory)
                const status = getProductStockStatus(product, inventory)
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-brand-50/60"
                  >
                    <ProductIcon product={product} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium text-ink-500">
                        {product.sku} · Min {product.minStockLevel}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-ink-900">{total}</p>
                      <Badge className={stockStatusClass(status)}>
                        {stockStatusLabel(status)}
                      </Badge>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        <div className="pro-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-ink-900">
                Recent Movements
              </h2>
              <p className="text-xs font-medium text-ink-500">
                Stock in, out, transfers & adjustments
              </p>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              All movements
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentMovements.map((mov) => {
              const product = products.find((p) => p.id === mov.productId)
              const shop = shops.find((s) => s.id === mov.shopId)
              const isIn =
                mov.type === 'in' ||
                (mov.type === 'adjustment' && mov.quantity > 0)
              return (
                <div key={mov.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div
                    className={`mt-0.5 rounded-lg p-1.5 ${
                      isIn
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isIn ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {product?.name ?? 'Product'}
                    </p>
                    <p className="text-xs font-medium text-ink-500">
                      {shop?.city} · {mov.reference} · {mov.performedBy}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-ink-400">
                      {formatDateTime(mov.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{ color: MOVEMENT_COLORS[mov.type] }}
                    >
                      {mov.type === 'out' || mov.type === 'transfer'
                        ? '-'
                        : mov.type === 'adjustment' && mov.quantity < 0
                          ? ''
                          : '+'}
                      {Math.abs(mov.quantity)}
                    </p>
                    <p className="text-[11px] font-semibold capitalize text-ink-400">
                      {mov.type}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {shops.map((shop) => {
          const items = inventory.filter((i) => i.shopId === shop.id)
          const units = items.reduce((s, i) => s + i.quantity, 0)
          const staff = salesPersons.filter((sp) => sp.shopId === shop.id)
          return (
            <Link
              key={shop.id}
              to={`/shops/${shop.id}`}
              className="pro-card p-5 transition duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">
                    {shop.code}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-ink-900">
                    {shop.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-ink-500">
                    {shop.city}, {shop.state}
                  </p>
                </div>
                <div className="rounded-xl bg-steel-100 p-2 text-steel-700">
                  <Store className="h-5 w-5" strokeWidth={1.75} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-brand-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-ink-400">Units</p>
                  <p className="text-lg font-bold text-ink-900">{units}</p>
                </div>
                <div className="rounded-xl bg-steel-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-ink-400">Staff</p>
                  <p className="text-lg font-bold text-ink-900">
                    {staff.length}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-ink-500">
                Manager: {shop.managerName}
              </p>
            </Link>
          )
        })}
      </div>

      <div className="pro-card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-ink-900">
              Active Distributors
            </h2>
            <p className="text-xs font-medium text-ink-500">
              Supply partners for bathroom equipment
            </p>
          </div>
          <Link
            to="/distributors"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Manage distributors
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {distributors.map((d) => (
            <Link
              key={d.id}
              to={`/distributors/${d.id}`}
              className="rounded-xl border border-border bg-brand-50/50 p-3.5 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <p className="text-sm font-bold text-ink-900">{d.companyName}</p>
              <p className="mt-0.5 text-xs font-medium text-ink-500">{d.city}</p>
              <p className="mt-2 text-[11px] font-semibold text-ink-400">
                {d.categories.length} categories · ★ {d.rating}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

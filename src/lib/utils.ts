import type { InventoryItem, Product, StockStatus } from '../types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function getAvailableQty(item: InventoryItem): number {
  return Math.max(0, item.quantity - item.reserved)
}

export function getProductTotalStock(
  productId: string,
  inventory: InventoryItem[],
): number {
  return inventory
    .filter((i) => i.productId === productId)
    .reduce((sum, i) => sum + i.quantity, 0)
}

export function getStockStatus(
  quantity: number,
  minStockLevel: number,
): StockStatus {
  if (quantity <= 0) return 'out_of_stock'
  if (quantity <= minStockLevel) return 'low_stock'
  return 'in_stock'
}

export function getProductStockStatus(
  product: Product,
  inventory: InventoryItem[],
): StockStatus {
  const total = getProductTotalStock(product.id, inventory)
  return getStockStatus(total, product.minStockLevel)
}

export function stockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'in_stock':
      return 'In Stock'
    case 'low_stock':
      return 'Low Stock'
    case 'out_of_stock':
      return 'Out of Stock'
  }
}

export function stockStatusClass(status: StockStatus): string {
  switch (status) {
    case 'in_stock':
      return 'bg-brand-100 text-brand-700'
    case 'low_stock':
      return 'bg-amber-50 text-amber-800'
    case 'out_of_stock':
      return 'bg-red-50 text-red-700'
  }
}

export const PRODUCT_CATEGORIES = [
  'Faucets & Mixers',
  'Showers',
  'Toilets & Closets',
  'Wash Basins',
  'Bathtubs',
  'Mirrors & Cabinets',
  'Accessories',
  'Pipes & Fittings',
  'Water Heaters',
] as const

export const SALES_ROLES = [
  'Senior Sales',
  'Sales Executive',
  'Junior Sales',
] as const

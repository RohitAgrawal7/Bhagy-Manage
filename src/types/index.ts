export type ProductCategory =
  | 'Faucets & Mixers'
  | 'Showers'
  | 'Toilets & Closets'
  | 'Wash Basins'
  | 'Bathtubs'
  | 'Mirrors & Cabinets'
  | 'Accessories'
  | 'Pipes & Fittings'
  | 'Water Heaters'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  brand: string
  description: string
  material: string
  finish: string
  dimensions: string
  warrantyMonths: number
  costPrice: number
  sellingPrice: number
  minStockLevel: number
  unit: string
  imageEmoji: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Shop {
  id: string
  code: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  managerName: string
  openingHours: string
  isActive: boolean
  establishedDate: string
}

export interface InventoryItem {
  id: string
  productId: string
  shopId: string
  quantity: number
  reserved: number
  lastRestockedAt: string
  updatedAt: string
}

export interface SalesPerson {
  id: string
  employeeCode: string
  name: string
  email: string
  phone: string
  shopId: string
  role: 'Senior Sales' | 'Sales Executive' | 'Junior Sales'
  joinDate: string
  targetMonthly: number
  commissionPercent: number
  address: string
  isActive: boolean
}

export interface Distributor {
  id: string
  code: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  gstNumber: string
  categories: ProductCategory[]
  paymentTerms: string
  creditLimit: number
  rating: number
  isActive: boolean
  since: string
}

export interface StockMovement {
  id: string
  productId: string
  shopId: string
  type: MovementType
  quantity: number
  toShopId?: string
  reference: string
  notes: string
  performedBy: string
  createdAt: string
}

export interface AppState {
  products: Product[]
  shops: Shop[]
  inventory: InventoryItem[]
  salesPersons: SalesPerson[]
  distributors: Distributor[]
  movements: StockMovement[]
}

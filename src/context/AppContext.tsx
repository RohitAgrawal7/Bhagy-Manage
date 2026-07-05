import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { seedData } from '../data/seed'
import { uid } from '../lib/utils'
import type {
  AppState,
  Distributor,
  InventoryItem,
  MovementType,
  Product,
  SalesPerson,
  Shop,
  StockMovement,
} from '../types'

const STORAGE_KEY = 'bhagyalaxmi-inventory-v1'

interface AppContextValue extends AppState {
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addShop: (shop: Omit<Shop, 'id'>) => void
  updateShop: (id: string, shop: Partial<Shop>) => void
  deleteShop: (id: string) => void
  addSalesPerson: (person: Omit<SalesPerson, 'id'>) => void
  updateSalesPerson: (id: string, person: Partial<SalesPerson>) => void
  deleteSalesPerson: (id: string) => void
  addDistributor: (distributor: Omit<Distributor, 'id'>) => void
  updateDistributor: (id: string, distributor: Partial<Distributor>) => void
  deleteDistributor: (id: string) => void
  adjustStock: (params: {
    productId: string
    shopId: string
    type: MovementType
    quantity: number
    toShopId?: string
    reference: string
    notes: string
    performedBy: string
  }) => void
  resetData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignore */
  }
  return seedData
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addProduct = useCallback(
    (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const id = uid('prod')
      setState((prev) => {
        const inventory: InventoryItem[] = prev.shops.map((shop) => ({
          id: uid('inv'),
          productId: id,
          shopId: shop.id,
          quantity: 0,
          reserved: 0,
          lastRestockedAt: now,
          updatedAt: now,
        }))
        return {
          ...prev,
          products: [
            ...prev.products,
            { ...product, id, createdAt: now, updatedAt: now },
          ],
          inventory: [...prev.inventory, ...inventory],
        }
      })
    },
    [],
  )

  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id
          ? { ...p, ...product, updatedAt: new Date().toISOString() }
          : p,
      ),
    }))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
      inventory: prev.inventory.filter((i) => i.productId !== id),
      movements: prev.movements.filter((m) => m.productId !== id),
    }))
  }, [])

  const addShop = useCallback((shop: Omit<Shop, 'id'>) => {
    const id = uid('shop')
    const now = new Date().toISOString()
    setState((prev) => {
      const inventory: InventoryItem[] = prev.products.map((product) => ({
        id: uid('inv'),
        productId: product.id,
        shopId: id,
        quantity: 0,
        reserved: 0,
        lastRestockedAt: now,
        updatedAt: now,
      }))
      return {
        ...prev,
        shops: [...prev.shops, { ...shop, id }],
        inventory: [...prev.inventory, ...inventory],
      }
    })
  }, [])

  const updateShop = useCallback((id: string, shop: Partial<Shop>) => {
    setState((prev) => ({
      ...prev,
      shops: prev.shops.map((s) => (s.id === id ? { ...s, ...shop } : s)),
    }))
  }, [])

  const deleteShop = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shops: prev.shops.filter((s) => s.id !== id),
      inventory: prev.inventory.filter((i) => i.shopId !== id),
      salesPersons: prev.salesPersons.filter((sp) => sp.shopId !== id),
      movements: prev.movements.filter(
        (m) => m.shopId !== id && m.toShopId !== id,
      ),
    }))
  }, [])

  const addSalesPerson = useCallback((person: Omit<SalesPerson, 'id'>) => {
    setState((prev) => ({
      ...prev,
      salesPersons: [...prev.salesPersons, { ...person, id: uid('sp') }],
    }))
  }, [])

  const updateSalesPerson = useCallback(
    (id: string, person: Partial<SalesPerson>) => {
      setState((prev) => ({
        ...prev,
        salesPersons: prev.salesPersons.map((sp) =>
          sp.id === id ? { ...sp, ...person } : sp,
        ),
      }))
    },
    [],
  )

  const deleteSalesPerson = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      salesPersons: prev.salesPersons.filter((sp) => sp.id !== id),
    }))
  }, [])

  const addDistributor = useCallback(
    (distributor: Omit<Distributor, 'id'>) => {
      setState((prev) => ({
        ...prev,
        distributors: [
          ...prev.distributors,
          { ...distributor, id: uid('dist') },
        ],
      }))
    },
    [],
  )

  const updateDistributor = useCallback(
    (id: string, distributor: Partial<Distributor>) => {
      setState((prev) => ({
        ...prev,
        distributors: prev.distributors.map((d) =>
          d.id === id ? { ...d, ...distributor } : d,
        ),
      }))
    },
    [],
  )

  const deleteDistributor = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      distributors: prev.distributors.filter((d) => d.id !== id),
    }))
  }, [])

  const adjustStock = useCallback(
    (params: {
      productId: string
      shopId: string
      type: MovementType
      quantity: number
      toShopId?: string
      reference: string
      notes: string
      performedBy: string
    }) => {
      const now = new Date().toISOString()
      const movement: StockMovement = {
        id: uid('mov'),
        productId: params.productId,
        shopId: params.shopId,
        type: params.type,
        quantity: params.quantity,
        toShopId: params.toShopId,
        reference: params.reference,
        notes: params.notes,
        performedBy: params.performedBy,
        createdAt: now,
      }

      setState((prev) => {
        const inventory = prev.inventory.map((item) => {
          if (
            item.productId === params.productId &&
            item.shopId === params.shopId
          ) {
            let qty = item.quantity
            if (params.type === 'in') qty += params.quantity
            else if (params.type === 'out') qty -= params.quantity
            else if (params.type === 'transfer') qty -= params.quantity
            else if (params.type === 'adjustment') qty += params.quantity
            return {
              ...item,
              quantity: Math.max(0, qty),
              lastRestockedAt:
                params.type === 'in' ? now : item.lastRestockedAt,
              updatedAt: now,
            }
          }
          if (
            params.type === 'transfer' &&
            params.toShopId &&
            item.productId === params.productId &&
            item.shopId === params.toShopId
          ) {
            return {
              ...item,
              quantity: item.quantity + params.quantity,
              lastRestockedAt: now,
              updatedAt: now,
            }
          }
          return item
        })

        return {
          ...prev,
          inventory,
          movements: [movement, ...prev.movements],
        }
      })
    },
    [],
  )

  const resetData = useCallback(() => {
    setState(seedData)
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      addProduct,
      updateProduct,
      deleteProduct,
      addShop,
      updateShop,
      deleteShop,
      addSalesPerson,
      updateSalesPerson,
      deleteSalesPerson,
      addDistributor,
      updateDistributor,
      deleteDistributor,
      adjustStock,
      resetData,
    }),
    [
      state,
      addProduct,
      updateProduct,
      deleteProduct,
      addShop,
      updateShop,
      deleteShop,
      addSalesPerson,
      updateSalesPerson,
      deleteSalesPerson,
      addDistributor,
      updateDistributor,
      deleteDistributor,
      adjustStock,
      resetData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

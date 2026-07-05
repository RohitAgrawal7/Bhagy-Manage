import {
  Bath,
  Droplets,
  Flame,
  Frame,
  Package,
  Pipette,
  ShowerHead,
  Sparkles,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { Product, ProductCategory } from '../../types'

const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  'Faucets & Mixers': Droplets,
  Showers: ShowerHead,
  'Toilets & Closets': Bath,
  'Wash Basins': Waves,
  Bathtubs: Bath,
  'Mirrors & Cabinets': Frame,
  Accessories: Sparkles,
  'Pipes & Fittings': Pipette,
  'Water Heaters': Flame,
}

const sizes = {
  sm: {
    box: 'h-9 w-9 rounded-lg',
    icon: 'h-4 w-4',
  },
  md: {
    box: 'h-11 w-11 rounded-xl',
    icon: 'h-5 w-5',
  },
  lg: {
    box: 'h-16 w-16 rounded-2xl',
    icon: 'h-7 w-7',
  },
} as const

export function ProductIcon({
  product,
  category,
  size = 'md',
  className = '',
}: {
  product?: Pick<Product, 'category' | 'name'>
  category?: ProductCategory
  size?: keyof typeof sizes
  className?: string
}) {
  const cat = product?.category ?? category ?? 'Accessories'
  const Icon = CATEGORY_ICONS[cat] ?? Package
  const s = sizes[size]

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 shadow-sm ring-1 ring-brand-200/80 ${s.box} ${className}`}
      title={product?.name ?? cat}
      aria-hidden={!product?.name}
    >
      <Icon className={s.icon} strokeWidth={1.75} />
    </div>
  )
}

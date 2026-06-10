import type { MaterialCategory } from "./materialCategory.dto.js"

interface Material {
    id: string
    name: string
    categoryId: string
    unit: string
    currentStock: any // Decimal
    rate: any // Decimal
    createdAt: Date
    category?: MaterialCategory
}

interface MaterialData {
    name: string
    categoryId: string
    unit: string
    currentStock: number
    rate: number
}

export type { Material, MaterialData }

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
    sentToSite: boolean
}

interface MaterialData {
    name: string
    categoryId: string
    unit: string
    currentStock: number
    rate: number
    sentToSite?: boolean
}

export type { Material, MaterialData }

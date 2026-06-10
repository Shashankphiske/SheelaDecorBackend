import type { MachineCategory } from "./machineCategory.dto.js"
import type { MachineBrand } from "./machineBrand.dto.js"

interface Machine {
    id: string
    name: string
    categoryId: string
    brandId: string
    purchaseDate: Date | null
    location: string | null
    status: "AVAILABLE" | "NOT_AVAILABLE"
    createdAt: Date
    category?: MachineCategory
    brand?: MachineBrand
}

interface MachineData {
    name: string
    categoryId: string
    brandId: string
    purchaseDate?: string | Date | null
    location?: string | null
    status: "AVAILABLE" | "NOT_AVAILABLE"
}

export type { Machine, MachineData }

import type { Decimal } from "@prisma/client/runtime/client"
import type { SellingUnit } from "./product.dto.js"
import type { Artisan } from "./artisan.dto.js"

interface ProjectLabour {
    id: string
    projectId: string
    productId: string
    artisanId: string
    price: number
    unit: SellingUnit
    key: string
    quantity: number
    artisan: Artisan
}

interface ProjectLabourData {
    projectId: string
    productId: string
    artisanId: string
    price: number
    unit: SellingUnit
    key: string
    quantity: number
}

export type { ProjectLabour, ProjectLabourData }
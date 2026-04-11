import type { SellingUnit } from "./product.dto.js"

interface Stitching {
    id: string
    name: string
    price: number
    unit: SellingUnit
    productId: string
}

interface StitchingData {
    name: string
    price: number
    unit: SellingUnit
    productId: string
}

export type { Stitching, StitchingData }
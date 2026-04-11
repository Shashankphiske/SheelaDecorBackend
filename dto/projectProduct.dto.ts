import type { SellingUnit } from "./product.dto.js"

type ProductStatus = "PENDING" | "ORDERED" | "RECEIVED" | "INSTOCK";

interface ProjectProduct {
    id: string
    projectId: string
    productId: string
    areaId: string | null
    price: number
    quantity: number
    companyId: string | null
    catalogueId: string | null
    designNo: number
    references: string | null
    measurementUnit: SellingUnit
    width: number | null
    height: number | null
    length: number | null
    orderId: string | null
    remark: string | null
    status: ProductStatus
}

interface ProjectProductData {
    productId: string
    areaId?: string
    price: number
    quantity: number
    companyId?: string
    catalogueId?: string
    designNo: number
    references?: string
    measurementUnit: SellingUnit
    width?: number
    height?: number
    length?: number
}

export type { ProjectProduct, ProjectProductData }
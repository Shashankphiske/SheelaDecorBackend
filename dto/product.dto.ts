type SellingUnit =  "METER" | "FEET" | "INCHES" | "CENTIMETER" | "PANHA"
type ProductType = "FABRIC" | "AREA" | "RUNNING_LENGTH" | "PEICE" | "FIXED_LENGTH" | "FIXED_AREA" | "TAILORING" 

interface Product {
    id: string
    name: string
    description: string | null
    sellingUnit: SellingUnit
    productType: ProductType
    price: number
    tax_rate: number
    createdAt: Date
}

interface ProductData {
    name: string
    description: string | null
    sellingUnit: SellingUnit
    productType: ProductType
    price: number
    tax_rate: number
}

export type { Product, ProductData, SellingUnit, ProductType }
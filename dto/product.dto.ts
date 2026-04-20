type SellingUnit =  "METER" | "FEET" | "INCHES" | "CENTIMETER" | "PANHA"
type ProductType = "FABRIC" | "AREA" | "RUNNING_LENGTH" | "PEICE" | "FIXED_LENGTH" | "FIXED_AREA" | "TAILORING" | "SOFA_TYPE"
type DimensionType = "lb" | "lh" | "bh" | "lbh"

interface Product {
    id: string
    name: string
    description: string | null
    sellingUnit: SellingUnit
    productType: ProductType
    price: number
    taxRate: number
    dimensionType: DimensionType
    createdAt: Date
}

interface ProductData {
    name: string
    description: string | null
    sellingUnit: SellingUnit
    productType: ProductType
    price: number
    taxRate: number
    dimensionType: DimensionType
}

export type { Product, ProductData, SellingUnit, ProductType, DimensionType }
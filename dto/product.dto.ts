type SellingUnit =  "METER" | "FEET" | "INCHES" | "CENTIMETER" | "PANHA" | "RFT" | "SQFT" | "SQM" | "SQY" | "ROLL" | "PIECE" | "PANEL"

type ProductType =

    | "SOFA"
    | "CHAIR"
    | "OTTOMANS_PUFFY"

    | "CURTAIN"
    | "ROMAN_BLINDS"
    | "CORIAN"

    | "ORTHO_QUIRE_GAADI"
    | "BEDBACK"
    | "PILLOW_COVERS"

    | "CUSTOM_WALLPAPERS"
    | "WOODEN_FLOORING"
    | "PVC_FLOORING"

    | "CARPET"
    | "RUBBER_GYM_FLOORING"
    | "ROLLER_ZEBRA_VENETIAN_VERTICALBLINDS"

    | "BLINDS"
    | "BEDSHEET"
    | "PILLOW"

    | "MATTRESS_READY"
    | "MATTRESS_PROTECTOR"
    | "COMFORTERS"

    | "DINING"
    | "WALLPAPER_ROLL"
    | "RUGS";

type ProductCategory = "CUSTOM" | "AREA" | "READY";


type DimensionType = "lw" | "lh" | "lwh" | "l";

interface Product {
    id: string
    name: string
    description: string | null
    sellingUnit: SellingUnit
    productType: ProductType
    productCateogry: ProductCategory
    price: number
    size: number
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
    size: number
    taxRate: number
    dimensionType: DimensionType
}

export type { Product, ProductData, SellingUnit, ProductType, DimensionType }
interface Catalogue {
    id: string
    name: string
    brandId?: string
    type?: string
    price?: number
    launchYear?: String
    rackNo?: number
    description?: string
    createdAt: Date
}

interface CatalogueData {
    name: string
    brandId: string | null
    type: string | null
    price: number | null
    launchYear: String | null
    rackNo: number | null
    description: string | null
}

export type { Catalogue, CatalogueData }
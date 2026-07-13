interface Catalogue {
    id: string
    name: string
    brandId?: string
    type?: string
    price?: number
    launchYear?: String
    rackNo?: string
    description?: string
    createdAt: Date
}

interface CatalogueData {
    name: string
    brandId: string
    type: string | null
    price: number | null
    launchYear: String | null
    rackNo: string | null
    description: string | null
}

export type { Catalogue, CatalogueData }
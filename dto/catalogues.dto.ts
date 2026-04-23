interface Catalogue {
    id: string
    name: string
    brandId: string
    type: string
    price: number
    launchYear: String
    rackNo: number
    description?: string
    createdAt: Date
}

interface CatalogueData {
    name: string
    brandId: string
    type: string
    price: number
    launchYear: String
    rackNo: number
    description?: string
}

export type { Catalogue, CatalogueData }
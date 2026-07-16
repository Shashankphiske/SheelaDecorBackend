interface Catalogue {
    id: string
    name: string
    brandId?: string
    type?: string
    lowerRrp?: number
    higherRrp?: number
    launchYear?: String
    rackNo?: string
    description?: string
    createdAt: Date
}

interface CatalogueData {
    name: string
    brandId: string
    type: string | null
    lowerRrp: number | null
    higherRrp: number | null
    launchYear: String | null
    rackNo: string | null
    description: string | null
}

export type { Catalogue, CatalogueData }
interface Catalogue {
    id: string
    name: string
    description: string | null
    createdAt: Date
}

interface CatalogueData {
    name: string
    description?: string
}

export type { Catalogue, CatalogueData }
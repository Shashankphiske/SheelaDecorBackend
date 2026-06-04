interface CataloguesGivenTo {
    id: string
    givenDate: Date
    clientName: string
    siteName: string
    catalogueId: string
    receivedStatus: boolean
    createdAt: Date
}

interface CataloguesGivenToData {
    givenDate: Date
    clientName: string
    siteName: string
    catalogueId: string
    catalogueIds?: string[]
    receivedStatus: boolean
}

export type { CataloguesGivenTo, CataloguesGivenToData }

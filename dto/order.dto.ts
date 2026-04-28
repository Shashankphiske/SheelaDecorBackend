interface Order {
    id: string
    customerId: string
    projectId: string
    productId: string
    catalogueId: string | null
    brandId: string | null
    areaId: string | null
    orderedDate: Date | null
    quantity: number | null
    orderId: string | null
    receivedDate: Date | null
    customer: {
        id: string,
        name: string
    },
    product: {
        id: string,
        name: string
    },
    project: {
        id: string
        name: string
    },
    brand: {
        id: string,
        name: string
    },
    catalogue: {
        id: string,
        name: string
    },
    area: {
        id: string,
        name: string
    }
}

interface OrderData {
    customerId: string
    projectId: string
    productId: string
    catalogueId?: string
    brandId?: string
    areaId?: string
    orderedDate?: Date
    quantity?: number
    orderId?: string
    receivedDate?: Date
}

export type { Order, OrderData }
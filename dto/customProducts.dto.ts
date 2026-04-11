interface CustomProducts {
    id: string
    name: string
    quantity: number
    price: number
    tax: number
    remarks: string
    projectId: string

}

interface CustomProductsData {
    name: string
    quantity: number
    price: number
    tax: number
    remarks: string
}

export type { CustomProducts, CustomProductsData }
interface Customer {
    id: string
    name: string
    phonenumber: string
    email: string
    alternatePhonenumber: string | null
    address: string
    createdAt: Date
}

interface CustomerData {
    name: string
    phonenumber: number
    email: string
    alternatePhonenumber: number | null
    address: string
}

export type { Customer, CustomerData }
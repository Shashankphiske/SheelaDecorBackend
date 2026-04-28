interface Customer {
    id: string
    name: string
    phonenumber: string 
    email: string | null
    alternatePhonenumber: string | null
    address: string | null
    createdAt: Date
}

interface CustomerData {
    name: string
    phonenumber: string
    email?: string
    alternatePhonenumber?: string
    address?: string
}

export type { Customer, CustomerData }
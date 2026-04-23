import type { DealsIn } from "./dealsIn.dto.js"

interface Dealer {
    id: string
    name: string
    description: string | null
    dealsInId: string | null
    personName: string
    phonenumber: string | null
    email: string | null
    catalogueLink: string | null
    address: string | null
    createdAt: Date
    DealsIn: DealsIn
}

interface DealerData {
    name: string
    description?: string
    dealsInId?: string
    personName: string
    phonenumber?: string
    email?: string
    catalogueLink?: string
    address?: string
}

export type { Dealer, DealerData }
interface Tailor {
    id: string
    name: string
    phonenumber: string | null
    email: string | null
    address: string | null
    createdAt: Date
}

interface TailorData {
    name: string
    phonenumber: string | null
    email: string | null
    address: string | null
}

export type { Tailor, TailorData }
interface Interior {
    id: string
    name: string
    phonenumber: string | null
    email: string | null
    alternatePhonenumber: string | null
    address: string | null
    commissionFeePercentage: number | null
    createdAt: Date
}

interface InteriorData {
    name: string
    phonenumber?: string | null
    email?: string | null
    alternatePhonenumber?: string | null
    address?: string | null
    commissionFeePercentage?: number | null
}

export type { Interior, InteriorData }

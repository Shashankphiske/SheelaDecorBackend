type ArtisanType = "TAILOR" | "SOFA_WORKER"

interface Artisan {
    id: string
    name: string
    artisanType: ArtisanType
    phonenumber: string | null
    email: string | null
    address: string | null
    createdAt: Date
}

interface ArtisanData {
    name: string
    artisanType: ArtisanType
    phonenumber: string | null
    email: string | null
    address: string | null
}

export type { Artisan, ArtisanData }
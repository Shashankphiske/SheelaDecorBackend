import type { ArtisanType } from "./artisanType.dto.js"

interface Artisan {
    id: string
    name: string
    artisanTypeId: string
    phonenumber: string | null
    email: string | null
    address: string | null
    price: number
    createdAt: Date
    artisanType: ArtisanType
}

interface ArtisanData {
    name: string
    artisanTypeId: string
    phonenumber: string | null
    email: string | null
    address: string | null
    price: number
}

export type { Artisan, ArtisanData }
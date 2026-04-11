type Role = "USER" | "ADMIN" | "INTERIOR" | "SALES_ASSOCIATE"

interface User {
    id: string
    username: string
    email: string
    password: string
    role: Role
    createdAt: Date
    phonenumber: number | null,
    alternatePhonenumber: number | null
    address: string | null
}

interface UserData {
    username: string
    email: string
    password: string
}

export type { User, UserData };
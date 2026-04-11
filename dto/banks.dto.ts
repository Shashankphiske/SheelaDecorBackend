type BankTypes = "SAVINGS" | "CURRENT" | "SALARY" | "RECURRING"

interface Banks {
    id: string
    bankName: string
    accountName: string | null
    branch: string
    pincode: string
    accountNumber: string
    ifscCode: string
    accountType: BankTypes
    createdAt: Date
}

interface BanksData {
    bankName: string
    accountName?: string
    branch: string
    pincode: string
    accountNumber: string
    ifscCode: string
    accountType: BankTypes
}

export type { Banks, BanksData, BankTypes }
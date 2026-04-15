
type PaymentType = "CREDIT" | "DEBIT"

interface PaymentData {
    customerId: string
    projectId: string
    amount: number
    type: PaymentType
    paymentMode: string
    remarks?: string
}

interface Payment {
    id: string
    customerId: string
    projectId: string
    amount: number
    type: PaymentType
    paymentMode: string
    remarks: string | null
    createdAt: Date
}

export type { Payment, PaymentData, PaymentType }
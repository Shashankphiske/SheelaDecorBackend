interface Inquiry {
    id: string
    projectName: string
    customerName: string
    phonenumber: number
    comments: string | null
    createdAt: Date
    followUpDate: Date
}

interface InquiryData {
    projectName: string
    customerName: string
    phonenumber: number
    comments?: string
    createdAt: Date
    followUpDate: Date
}

export type { Inquiry, InquiryData }
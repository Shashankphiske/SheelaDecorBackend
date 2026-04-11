type ProjectStatus = "PENDING" | "ACTIVE" | "GOODS_PENDING" | "GOODS_COMPLETE" | "TAILOR_PENDING" | "TAILOR_COMPLETE" | "COMPLETED" | "DEFAULTER"

interface Project {
    id: string
    name: string
    customerId: string
    totalAmount: number
    totalTax: number
    paid: number
    discount: number
    discountType: string
    projectDate: Date
    additionalRequest: string | null
    address: string | null
    status: ProjectStatus
    createdAt: Date
    creatorId: string
    bankId: string
}

interface ProjectData {
    name: string
    customerId: string
    totalAmount: number
    totalTax: number
    paid: number
    discount: number
    discountType: string
    projectDate: Date
    additionalRequest?: string
    address?: string
    status: ProjectStatus
    createdAt: Date
    creatorId: string
    bankId: string
}

export type { Project, ProjectData, ProjectStatus }
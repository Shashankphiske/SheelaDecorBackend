import type { Customer } from "./customer.dto.js"
import type { Payment } from "./payment.dto.js"
import type { ProjectLabour } from "./projectLabour.dto.js"
import type { ProjectProduct } from "./projectProduct.dto.js"
import type { Task } from "./tasks.dto.js"

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
    customer: {
        name: string
    }
    creator: {
        name: string
    }
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
interface MeasurementData {
    id: string
    areaId: string
    productId: string
    length: number | null
    width: number | null
    height: number | null
    unit: string | null
    measurementId: string
}

interface Measurement {
    id: string
    projectName: string
    createdAt: Date
    measurementData: MeasurementData[]
}

export type { Measurement }
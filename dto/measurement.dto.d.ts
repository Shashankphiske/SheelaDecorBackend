interface MeasurementData {
    id: string;
    areaId: string;
    productId: string;
    length: number | null;
    width: number | null;
    height: number | null;
    measurementId: string;
}
interface Measurement {
    id: string;
    projectName: string;
    createdAt: Date;
    measurementData: MeasurementData[];
}
export type { Measurement };
//# sourceMappingURL=measurement.dto.d.ts.map
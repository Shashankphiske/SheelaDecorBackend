import type { SellingUnit } from "./product.dto.js";
import type { Artisan } from "./artisan.dto.js";
type LabourStatus = "PENDING" | "COMPLETED" | "RECEIVED";
interface ProjectLabour {
    id: string;
    projectId: string;
    productId: string;
    artisanId: string | null;
    price: number;
    unit: SellingUnit;
    key: string;
    quantity: number;
    artisan: Artisan | null;
    status: LabourStatus;
    workName: string | null;
    labourType: "STITCHING" | "FABRICATION" | "FITTING";
}
interface ProjectLabourData {
    projectId: string;
    productId: string;
    artisanId: string | null;
    price: number;
    unit: SellingUnit;
    key: string;
    quantity: number;
    workName?: string | null;
    labourType?: "STITCHING" | "FABRICATION" | "FITTING";
}
export type { ProjectLabour, ProjectLabourData };
//# sourceMappingURL=projectLabour.dto.d.ts.map
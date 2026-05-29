import type { Measurement } from "../dto/measurement.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class MeasurementRepository extends BaseRepository<Measurement, any, any> {
    constructor();
    create: (data: any) => Promise<any>;
    update: (data: any, id: string, userId?: string) => Promise<any>;
    fetch: (id: string, userId?: string) => Promise<any>;
    hardDelete: (id: string, userId?: string) => Promise<any>;
}
export { MeasurementRepository };
//# sourceMappingURL=measurement.repository.d.ts.map
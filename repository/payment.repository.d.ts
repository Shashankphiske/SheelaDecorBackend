import type { PaginationData } from "../dto/pagination.dto.js";
import type { Payment, PaymentData } from "../dto/payment.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class PaymentRepository extends BaseRepository<Payment, PaymentData, any> {
    constructor();
    create: (data: PaymentData) => Promise<any>;
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
    update: (data: PaymentData, id: string, userId?: string) => Promise<void>;
    hardDelete: (id: string, userId?: string) => Promise<void>;
}
export { PaymentRepository };
//# sourceMappingURL=payment.repository.d.ts.map
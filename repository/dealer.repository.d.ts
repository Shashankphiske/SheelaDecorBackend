import type { Dealer, DealerData } from "../dto/dealer.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class DealerRepository extends BaseRepository<Dealer, DealerData, any> {
    constructor();
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { DealerRepository };
//# sourceMappingURL=dealer.repository.d.ts.map
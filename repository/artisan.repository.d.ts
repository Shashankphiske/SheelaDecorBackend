import type { Artisan, ArtisanData } from "../dto/artisan.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class ArtisanRepository extends BaseRepository<Artisan, ArtisanData, any> {
    constructor();
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { ArtisanRepository };
//# sourceMappingURL=artisan.repository.d.ts.map
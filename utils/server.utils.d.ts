import type { PaginationData } from "../dto/pagination.dto.js";
declare class ServerUtils {
    parseFilterValue: (value: any) => any;
    buildWhere: (baseWhere: any, filters: any, data: PaginationData, searchFields: string[], hasCreatedAt?: boolean) => {
        AND: any[];
    };
}
declare const serverUtils: ServerUtils;
export { serverUtils };
//# sourceMappingURL=server.utils.d.ts.map
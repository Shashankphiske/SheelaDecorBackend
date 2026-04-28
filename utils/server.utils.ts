import type { PaginationData } from "../dto/pagination.dto.js";
import { logger } from "./logger.util.js";

class ServerUtils {

    parseFilterValue = (value: any) => {
        if (typeof value == 'string' && value.includes(":")) {
            const [operator, rawValue] = value.split(":");
            const numericValue = Number(rawValue);

            if (['gt', 'gte', 'lt', 'lte'].includes(operator ?? "") && !isNaN(numericValue)) {
                return { [operator ?? ""]: numericValue };
            }
        }

        return value;
    }
    buildWhere = (baseWhere: any, filters: any, data: PaginationData, searchFields: string[]) => {
        const AND: any[] = [{ ...baseWhere }];
        Object.entries(baseWhere).forEach(([key, value]) => {
            AND.push({ [key]: value });
        });

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value != null && value !== 'undefined' && value !== "") {
                AND.push({ [key]: this.parseFilterValue(value) });
            }
        });
        if (data.search && searchFields.length > 0) {
            AND.push({
                OR: searchFields.map((field) => ({
                    [field]: {
                        contains: data?.search ,
                        mode: "insensitive"
                    }
                }))
            });
        }

        if (data.lastCreatedAt && data.lastId) {
            AND.push({
                OR: [
                    { createdAt: { lt: data.lastCreatedAt } },
                    {
                        AND: [
                            { createdAt: data.lastCreatedAt },
                            { id: { lt: data.lastId } }
                        ]
                    }
                ]
            });
        }
        return { AND };
    };

}

const serverUtils = new ServerUtils();

export { serverUtils }
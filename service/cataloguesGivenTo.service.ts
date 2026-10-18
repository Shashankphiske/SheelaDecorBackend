import { logger } from "../utils/logger.util.js";
import type { CataloguesGivenTo, CataloguesGivenToData } from "../dto/cataloguesGivenTo.dto.js";
import type { CataloguesGivenToRepository } from "../repository/cataloguesGivenTo.repository.js";
import { BaseService } from "./base.service.js";

class CataloguesGivenToService extends BaseService<CataloguesGivenTo, CataloguesGivenToData, any> {
    constructor(methods: CataloguesGivenToRepository) {
        super(methods, "CATALOGUESGIVENTO");
    }

    override create = async (data: any): Promise<any> => {
        const catalogueIds: string[] = Array.isArray(data.catalogueIds)
            ? data.catalogueIds
            : typeof data.catalogueIds === "string" && data.catalogueIds.trim()
                ? data.catalogueIds.split(",").map((s: string) => s.trim()).filter(Boolean)
                : data.catalogueId
                    ? [data.catalogueId]
                    : [];

        if (catalogueIds.length > 0) {
            const results = [];
            for (const catalogueId of catalogueIds) {
                const record = await this.method.create({
                    givenDate: data.givenDate,
                    clientName: data.clientName,
                    siteName: data.siteName,
                    catalogueId: catalogueId,
                    receivedStatus: data.receivedStatus ?? false
                });
                if (record && record.id) {
                    results.push(record);
                }
            }
            logger.info(`${this.modelName} records bulk created`, {
                count: results.length,
            });
            return results;
        }

        const record = await this.method.create(data);
        logger.info(`${this.modelName} created`, {
            id: record?.id,
        });
        return record;
    };
}

export { CataloguesGivenToService }

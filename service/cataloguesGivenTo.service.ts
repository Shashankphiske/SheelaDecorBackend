import { prisma } from "../db/prisma.js";
import { logger } from "../utils/logger.util.js";
import type { CataloguesGivenTo, CataloguesGivenToData } from "../dto/cataloguesGivenTo.dto.js";
import type { CataloguesGivenToRepository } from "../repository/cataloguesGivenTo.repository.js";
import { BaseService } from "./base.service.js";

class CataloguesGivenToService extends BaseService<CataloguesGivenTo, CataloguesGivenToData, any> {
    constructor(methods: CataloguesGivenToRepository) {
        super(methods, "CATALOGUESGIVENTO");
    }

    override create = async (data: any): Promise<any> => {
        if (Array.isArray(data.catalogueIds) && data.catalogueIds.length > 0) {
            const records = await prisma.$transaction(async (txClient) => {
                const txRepo = this.method.tx(txClient);
                const results = [];
                for (const catalogueId of data.catalogueIds) {
                    const record = await txRepo.create({
                        givenDate: data.givenDate,
                        clientName: data.clientName,
                        siteName: data.siteName,
                        catalogueId: catalogueId,
                        receivedStatus: data.receivedStatus ?? false
                    });
                    results.push(record);
                }
                return results;
            });
            logger.info(`${this.modelName} records bulk created`, {
                count: records.length,
            });
            return records;
        }

        const record = await this.method.create(data);
        logger.info(`${this.modelName} created`, {
            id: record.id,
        });
        return record;
    };
}

export { CataloguesGivenToService }

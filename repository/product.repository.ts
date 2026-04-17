import { includes } from "zod";
import { prisma } from "../db/prisma.js";
import type { Product, ProductData } from "../dto/product.dto.js";
import { BaseRepository } from "./base.repository.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";

class ProductRepository extends BaseRepository<any, any, any> {
    constructor() {
        super(prisma.products, "PRODUCT");
    }

    create = async (data: any): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.create({
                data: {
                    name: data.name,
                    description: data.description ?? null,
                    productType: data.productType,
                    sellingUnit: data.sellingUnit,
                    price: data.price,
                    taxRate: data.taxRate
                }
            });
            let stitching;
            if (product.productType == "TAILORING") {
                stitching = await tx.stitchings.create({
                    data: {
                        name: data.stitchingName,
                        price: data.stitchingPrice,
                        unit: data.stitchingUnit ?? "METER",
                        productId: product.id
                    }
                });
            }

            return { ...product, stitching };
        })
    }

    fetch = async (id: string, userId?: string): Promise<any> => {

        const where: any = {
            id
        };

        const record = await this.model.findFirst({
            where,
            include: {
                stitching: true
            }
        });
        return record;
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []): Promise<any> => {

        let where: any = {
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                { createdAt: (data.sort ?? "desc") as 'asc' | 'desc' },
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                stitching: true
            }
        });
    };

    update = async (data: any, id: string): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.update({
                where: {
                    id
                },
                data: {
                    name: data.name,
                    description: data.description ?? null,
                    productType: data.productType,
                    sellingUnit: data.sellingUnit,
                    price: data.price,
                    taxRate: data.taxRate
                }
            });
            let stitching;
            if (product.productType == "TAILORING") {
                stitching = await tx.stitchings.update({
                    where: {
                        productId: product.id
                    },
                    data: {
                        name: data.stitchingName,
                        price: data.stitchingPrice,
                        unit: data.stitchingUnit ?? "METER"
                    }
                });
            }

            return { ...product, stitching };
        })
    }
}

export { ProductRepository }
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
        const LABOUR_TYPES = ["TAILORING", "AP_CURTAIN", "ROMAN_CURTAIN", "SOFA_TYPE"];
        const SIZE_TYPES = ["AREA", "FIXED_AREA", "FABRIC", "RUNNING_LENGTH", "FIXED_LENGTH"];

        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.create({
                data: {
                    name: data.name,
                    description: data.description ?? null,
                    productType: data.productType,
                    sellingUnit: data.sellingUnit,
                    price: parseFloat(data.price),
                    taxRate: parseFloat(data.taxRate ?? 0),
                    dimensionType: data.dimensionType ?? null,
                    size: SIZE_TYPES.includes(data.productType) ? (data.size ?? null) : null,
                },
                select: {
                    id: true,
                    createdAt: true
                }
            });

            let stitching = null;
            if (LABOUR_TYPES.includes(data.productType ?? "")) {
                stitching = await tx.stitchings.create({
                    data: {
                        name: data.stitchingName,
                        price: parseFloat(data.stitchingPrice ?? 0),
                        unit: data.stitchingUnit ?? "METER",
                        productId: product.id,
                    },
                    select: {
                        id: true
                    }
                });
            }

            return { ...product, stitching };
        });
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
        const LABOUR_TYPES = ["TAILORING", "AP_CURTAIN", "ROMAN_CURTAIN", "SOFA_TYPE"];
        const SIZE_TYPES = ["AREA", "FIXED_AREA", "FABRIC", "RUNNING_LENGTH", "FIXED_LENGTH"];

        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description ?? null,
                    productType: data.productType,
                    sellingUnit: data.sellingUnit,
                    dimensionType: data.dimensionType ?? null,
                    price: parseFloat(data.price),
                    taxRate: parseFloat(data.taxRate ?? 0),
                    size: SIZE_TYPES.includes(data.productType) ? (data.size ?? null) : null,
                },
                select: {
                    id: true,
                    createdAt: true
                }
            });

            let stitching = null;

            if (LABOUR_TYPES.includes(data.productType ?? "")) {
                // upsert — handles case where stitching row doesn't exist yet
                await tx.stitchings.upsert({
                    where: {
                        productId: product.id
                    },
                    update: {
                        name: data.stitchingName,
                        price: parseFloat(data.stitchingPrice ?? 0),
                        unit: data.stitchingUnit ?? "METER",
                    },
                    create: {
                        name: data.stitchingName,
                        price: parseFloat(data.stitchingPrice ?? 0),
                        unit: data.stitchingUnit ?? "METER",
                        productId: product.id,
                    }
                });
            } else {
                // Product type changed away from a labour type — delete stitching if it exists
                await tx.stitchings.deleteMany({
                    where: { productId: product.id }
                });
            }

            return;
        });
    }
}

export { ProductRepository }
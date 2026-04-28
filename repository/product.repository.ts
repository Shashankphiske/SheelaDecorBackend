import { includes } from "zod";
import { prisma } from "../db/prisma.js";
import type { Product, ProductData } from "../dto/product.dto.js";
import { BaseRepository } from "./base.repository.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { DimensionType } from "../generated/prisma/enums.js";

class ProductRepository extends BaseRepository<any, any, any> {
    constructor() {
        super(prisma.products, "PRODUCT");
    }

create = async (data: any): Promise<any> => {
    const SIZE_TYPES = ["AREA", "FIXED_AREA", "FABRIC", "RUNNING_LENGTH", "FIXED_LENGTH"];

    return await prisma.$transaction(async (tx) => {

        const payload: any = {
            name: data.name, // required
        };

        // ── optional strings ─────────────────
        if (data.description) {
            payload.description = data.description;
        }

        if (data.productType) {
            payload.productType = data.productType;
        }

        if (data.sellingUnit) {
            payload.sellingUnit = data.sellingUnit;
        }

        // ── numbers ─────────────────────────
        if (data.price !== "" && data.price !== undefined) {
            const price = Number(data.price);
            if (!isNaN(price)) payload.price = price;
        }

        if (data.taxRate !== "" && data.taxRate !== undefined) {
            const tax = Number(data.taxRate);
            if (!isNaN(tax)) payload.taxRate = tax;
        }

        // ── enum ────────────────────────────
        if (
            data.dimensionType &&
            Object.values(DimensionType).includes(data.dimensionType)
        ) {
            payload.dimensionType = data.dimensionType as DimensionType;
        }

        // ── size logic ──────────────────────
        if (SIZE_TYPES.includes(data.productType)) {
            if (data.size !== "" && data.size !== undefined) {
                const size = Number(data.size);
                if (!isNaN(size)) payload.size = size;
            }
        }

        const product = await tx.products.create({
            data: payload,
            select: {
                id: true,
                createdAt: true,
            },
        });

        return product;
    });
};
    
    fetch = async (id: string, userId?: string): Promise<any> => {

        const where: any = {
            id
        };

        const record = await this.model.findFirst({
            where
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
            ]
        });
    };

    update = async (data: any, id: string): Promise<any> => {
        const LABOUR_TYPES = ["TAILORING", "AP_CURTAIN", "ROMAN_CURTAIN", "SOFA_TYPE"];
        const SIZE_TYPES = ["AREA", "FIXED_AREA", "FABRIC", "RUNNING_LENGTH", "FIXED_LENGTH"];

        return await prisma.$transaction(async (tx) => {
            await tx.products.update({
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

            return;
        });
    }
}

export { ProductRepository }
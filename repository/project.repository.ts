import { config } from "../config/index.js";
import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";

import type { PaginationData } from "../dto/pagination.dto.js";
import type { Project, ProjectData } from "../dto/project.dto.js";
import type { ProjectProductData } from "../dto/projectProduct.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";

class ProjectRepository  {
    private handlePrismaError(error: any): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new ServerError(errorMessage.NOTFOUND);
            }
            if (error.code === 'P2003') {
                throw new ServerError(errorMessage.INVALIDDATA);
            }
            if (error.code === 'P2002') {
                throw new ServerError(errorMessage.ALREADYTAKEN);
            }
        }
        throw error;
    }

    create = async (data: any) => {
        return await prisma.$transaction(async (tx) => {

            // ── 1. Project ────────────────────────────────────────────────────────

            const project = await tx.projects.create({
                data: {
                    name: data.name,
                    customerId: data.customerId,
                    totalAmount: data.totalAmount,
                    totalTax: data.totalTax,
                    paid: 0,
                    discount: data.discount,
                    discountType: data.discountType,
                    projectDate: new Date(data.projectDate),
                    additionalRequests: data.additionalRequest,
                    address: data.address,
                    status: "PENDING",
                    creatorId: data.creatorId,
                    bankId: data.bankId,
                } as any,
                select: {
                    id: true,
                    createdAt: true,
                    status: true,
                    paid: true,
                    creator: { select: { username: true } }
                }
            });

            // ── 2. Project Products ───────────────────────────────────────────────

            const areas: any[] = data.areas ?? [];

            const productRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => ({
                    projectId: project.id,
                    productId: item.productId,
                    areaId: area.areaId || null,
                    price: Number(item.mrp ?? 0),
                    quantity: Number(item.quantity ?? 1),
                    brandId: item.brandId || null,
                    catalogueId: item.catalogueId || null,
                    designNo: Number(item.designNo ?? 0),
                    references: item.reference || null,
                    measurementUnit: item.unit || null,
                    width: item.width != null ? Number(item.width) : null,
                    height: item.height != null ? Number(item.height) : null,
                    length: item.length != null ? Number(item.length) : null,
                    remark: item.remark || null,
                    orderId: null,
                    status: "PENDING",
                }))
            );

            if (productRows.length > 0) {
                await tx.projectProducts.createMany({
                    data: productRows as any,
                });
            }

            // ── 3. Auto-create initial Orders for each product ────────────────────
            // Stores the initial purchase intent — other fields filled later
            // from the orders page.

            const orderRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => ({
                    projectId: project.id,
                    customerId: data.customerId || null,
                    productId: item.productId,
                    catalogueId: item.catalogueId || null,
                    brandId: item.brandId || null,
                    areaId: area.areaId || null,
                    quantity: Number(item.quantity ?? 1),
                    orderedDate: null,
                    receivedDate: null,
                    orderId: null,
                }))
            );

            if (orderRows.length > 0) {
                await tx.orders.createMany({
                    data: orderRows as any,
                });
            }

            // ── 4. Project Labours ────────────────────────────────────────────────

            const labourData: any[] = data.labourData ?? [];

            const labourRows = labourData.map((labour: any) => ({
                projectId: project.id,
                artisanId: labour.artisanId || null,
                productId: labour.productId,
                price: Number(labour?.price) || 0,
                key: labour.key,
                quantity: Number(labour.quantity) || 0,
                unit: labour.unit,
            }));

            if (labourRows.length > 0) {
                await tx.projectLabours.createMany({
                    data: labourRows as any,
                });
            }

            return project;
        });
    };

    fetch = async (id: string) => {
        const project = await prisma.projects.findFirst({  // fix: was prisma.products
            where: {
                id,
                status: { not: "DEFAULTER" }
            },
            include: {
                customer: true,
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return project;
    };

    markAsDefaulter = async (id: string) => {
        const project = await prisma.projects.update({
            where: { id },
            data: { status: "DEFAULTER" },
        });

        return;
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []): Promise<any> => {
        let where: any = {};
        where = serverUtils.buildWhere(where, filters, data, searchFields);

        return await prisma.projects.findMany({
            take: data.limit ?? 10,
            where,
            orderBy: [
                { createdAt: (data.sort ?? "desc") as "asc" | "desc" },
                { id: (data.sort ?? "desc") as "asc" | "desc" }
            ],
            include: {
                customer: true,
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        });
    };

    update = async (data: any, id: string, userId?: string) => {
        return await prisma.$transaction(async (tx) => {

            // ── 1. Update Project ─────────────────────────────────────────────────

            const project = await tx.projects.update({
                where: { id },
                data: {
                    name: data.name,
                    customerId: data.customerId,
                    totalAmount: data.totalAmount,
                    totalTax: data.totalTax,
                    discount: data.discount,
                    discountType: data.discountType,
                    projectDate: new Date(data.projectDate),
                    additionalRequests: data.additionalRequest,
                    address: data.address,
                    status: data.status,
                    creatorId: data.creatorId,
                    bankId: data.bankId,
                } as any,
                select: { id: true }
            });

            // ── 2. Snapshot existing products + orders ────────────────────────────

            const existingProducts = await tx.projectProducts.findMany({
                where: { projectId: id },
                select: {
                    productId: true,
                    areaId: true,
                    orderId: true,
                    status: true,
                },
            });

            // Map: productId+areaId → { orderId, status }
            const productOrderMap = new Map<string, { orderId: string | null; status: string }>();
            for (const ep of existingProducts) {
                const key = `${ep.productId}_${ep.areaId ?? "null"}`;
                productOrderMap.set(key, { orderId: ep.orderId, status: ep.status });
            }

            // Snapshot existing orders for this project keyed the same way
            const existingOrders = await tx.orders.findMany({
                where: { projectId: id },
                select: {
                    id: true,
                    productId: true,
                    areaId: true,
                    orderedDate: true,
                    receivedDate: true,
                    orderId: true,
                },
            });

            // Map: productId+areaId → existing order record
            const existingOrderMap = new Map<string, typeof existingOrders[0]>();
            for (const eo of existingOrders) {
                const key = `${eo.productId}_${eo.areaId ?? "null"}`;
                existingOrderMap.set(key, eo);
            }

            // ── 3. Build new product rows ─────────────────────────────────────────

            const areas: any[] = data.areas ?? [];

            const incomingKeys = new Set<string>();

            const productRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => {
                    const key = `${item.productId}_${area.areaId || "null"}`;
                    incomingKeys.add(key);

                    const existing = productOrderMap.get(key);

                    return {
                        projectId: project.id,
                        productId: item.productId,
                        areaId: area.areaId || null,
                        price: Number(item.mrp ?? 0),
                        quantity: Number(item.quantity ?? 1),
                        brandId: item.brandId || null,
                        catalogueId: item.catalogueId || null,
                        designNo: Number(item.designNo ?? 0),
                        references: item.reference || null,
                        measurementUnit: item.unit || null,
                        width: item.width != null ? Number(item.width) : null,
                        height: item.height != null ? Number(item.height) : null,
                        length: item.length != null ? Number(item.length) : null,
                        remark: item.remark || null,
                        // Preserve order linkage
                        orderId: existing?.orderId ?? null,
                        status: existing?.status ?? "PENDING",
                    };
                })
            );

            await tx.projectProducts.deleteMany({ where: { projectId: id } });

            if (productRows.length > 0) {
                await tx.projectProducts.createMany({ data: productRows as any });
            }

            // ── 4. Sync Orders ────────────────────────────────────────────────────

            // Delete orders for products that were removed from the project
            const removedOrderIds = existingOrders
                .filter((eo) => {
                    const key = `${eo.productId}_${eo.areaId ?? "null"}`;
                    return !incomingKeys.has(key);
                })
                .map((eo) => eo.id);

            if (removedOrderIds.length > 0) {
                await tx.orders.deleteMany({
                    where: { id: { in: removedOrderIds } },
                });
            }

            // Update existing orders with latest customer/catalogue/brand/quantity
            // Only update fields the user may have changed — preserve orderedDate,
            // receivedDate, orderId which are managed from the orders page.
            for (const area of areas) {
                for (const item of area.areacollection ?? []) {
                    const key = `${item.productId}_${area.areaId || "null"}`;
                    const existingOrder = existingOrderMap.get(key);

                    if (existingOrder) {
                        // Product already had an order — update mutable fields only
                        await tx.orders.update({
                            where: { id: existingOrder.id },
                            data: {
                                customerId: data.customerId || null,
                                catalogueId: item.catalogueId || null,
                                brandId: item.brandId || null,
                                quantity: Number(item.quantity ?? 1),
                                // orderedDate, receivedDate, orderId — NOT touched
                                // those are owned by the orders page
                            },
                        });
                    } else {
                        // New product added to the project — create its order
                        await tx.orders.create({
                            data: {
                                projectId: id,
                                customerId: data.customerId || null,
                                productId: item.productId,
                                catalogueId: item.catalogueId || null,
                                brandId: item.brandId || null,
                                areaId: area.areaId || null,
                                quantity: Number(item.quantity ?? 1),
                                orderedDate: null,
                                receivedDate: null,
                                orderId: null,
                            },
                        });
                    }
                }
            }

            // ── 5. Reset Labours ──────────────────────────────────────────────────

            await tx.projectLabours.deleteMany({ where: { projectId: id } });

            const labourData: any[] = data.labourData ?? [];

            const labourRows = labourData.map((labour: any) => ({
                projectId: project.id,
                artisanId: labour.artisanId || null,
                productId: labour.productId,
                price: Number(labour?.price) || 0,
                key: labour.key,
                quantity: Number(labour.quantity) || 0,
                unit: labour.unit,
            }));

            if (labourRows.length > 0) {
                await tx.projectLabours.createMany({ data: labourRows as any });
            }

            return;
        });
    };

    delete = async (id: string, userId?: string) => {
        try {
            await prisma.projects.delete({
                where: { id }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };
}


export { ProjectRepository };
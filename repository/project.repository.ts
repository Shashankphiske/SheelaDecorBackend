import { config } from "../config/index.js";
import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";

import type { PaginationData } from "../dto/pagination.dto.js";
import type { Project, ProjectData } from "../dto/project.dto.js";
import type { ProjectProductData } from "../dto/projectProduct.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";

class ProjectRepository {
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

            let customerId = data.customerId;
            if (data._ && typeof data._ === "object") {
                const customer = await tx.customers.create({
                    data: {
                        name: data._.name,
                        phonenumber: data._.phonenumber || null,
                        alternatePhonenumber: data._.alternatePhonenumber || null,
                        email: data._.email || null,
                        address: data._.address || null,
                    }
                });
                customerId = customer.id;
            }

            // ── 1. Project ────────────────────────────────────────────────────────

            const project = await tx.projects.create({
                data: {
                    name: data.name,
                    customerId: customerId,
                    totalAmount: data.totalAmount,
                    totalTax: data.totalTax,
                    paid: 0,
                    discount: data.discount,
                    discountType: data.discountType,
                    deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
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

            const orderRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => ({
                    projectId: project.id,
                    customerId: customerId || null,
                    productId: item.productId,
                    catalogueId: item.catalogueId || null,
                    brandId: item.brandId || null,
                    areaId: area.areaId || null,
                    designNo: Number(item.designNo) ?? null,
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

            const labourRows = labourData.map((labour: any) => {
                let unit = labour.unit;
                if (unit === "MTR") unit = "METER";
                if (unit === "PCS") unit = "PIECE";

                const validUnits = ["METER", "FEET", "INCHES", "CENTIMETER", "PANHA", "RFT", "SQFT", "SQM", "SQY", "ROLL", "PIECE", "PANEL"];
                if (!validUnits.includes(unit)) {
                    unit = "PIECE";
                }

                return {
                    projectId: project.id,
                    artisanId: labour.artisanId || null,
                    productId: labour.productId,
                    price: Number(labour?.price) || 0,
                    key: labour.key,
                    quantity: Number(labour.quantity) || 0,
                    unit: unit,
                    workName: labour.workName || null,
                    labourType: labour.labourType || "STITCHING",
                };
            });

            if (labourRows.length > 0) {
                await tx.projectLabours.createMany({
                    data: labourRows as any,
                });
            }

            return project;
        });
    };

    fetch = async (id: string) => {
        const project = await prisma.projects.findFirst({
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
        const { artisanId, ...restFilters } = filters || {};
        const { startDate, endDate, ...restData } = data;
        let where: any = {};
        where = serverUtils.buildWhere(where, restFilters, restData as any, searchFields);

        if (startDate || endDate) {
            const projectDateFilter: any = {};
            if (startDate) {
                projectDateFilter.gte = new Date(startDate);
            }
            if (endDate) {
                projectDateFilter.lte = new Date(endDate);
            }
            if (!where.AND) {
                where.AND = [];
            }
            where.AND.push({
                deadlineDate: projectDateFilter
            });
        }

        if (artisanId) {
            if (!where.AND) {
                where.AND = [];
            }
            where.AND.push({
                projectLabours: {
                    some: {
                        artisanId: artisanId
                    }
                }
            });
        }

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

            let customerId = data.customerId;
            if (data._ && typeof data._ === "object") {
                const customer = await tx.customers.create({
                    data: {
                        name: data._.name,
                        phonenumber: data._.phonenumber || null,
                        alternatePhonenumber: data._.alternatePhonenumber || null,
                        email: data._.email || null,
                        address: data._.address || null,
                    }
                });
                customerId = customer.id;
            }

            // ── 1. Update Project ─────────────────────────────────────────────────

            const project = await tx.projects.update({
                where: { id },
                data: {
                    name: data.name,
                    customerId: customerId,
                    totalAmount: data.totalAmount,
                    totalTax: data.totalTax,
                    discount: data.discount,
                    discountType: data.discountType,
                    deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
                    additionalRequests: data.additionalRequest,
                    address: data.address,
                    status: data.status,
                    creatorId: data.creatorId,
                    bankId: data.bankId,
                } as any,
                select: { id: true }
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

            await tx.projectProducts.deleteMany({ where: { projectId: id } });

            if (productRows.length > 0) {
                await tx.projectProducts.createMany({
                    data: productRows as any,
                });
            }

            // ── 3. Auto-create initial Orders for each product ────────────────────

            const orderRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => ({
                    projectId: project.id,
                    customerId: customerId || null,
                    productId: item.productId,
                    catalogueId: item.catalogueId || null,
                    brandId: item.brandId || null,
                    areaId: area.areaId || null,
                    designNo: Number(item.designNo) ?? null,
                    quantity: Number(item.quantity ?? 1),
                    orderedDate: null,
                    receivedDate: null,
                    orderId: null,
                }))
            );

            await tx.orders.deleteMany({ where: { projectId: id } });

            if (orderRows.length > 0) {
                await tx.orders.createMany({
                    data: orderRows as any,
                });
            }

            // ── 4. Project Labours ────────────────────────────────────────────────

            const labourData: any[] = data.labourData ?? [];

            const labourRows = labourData.map((labour: any) => {
                let unit = labour.unit;
                if (unit === "MTR") unit = "METER";
                if (unit === "PCS") unit = "PIECE";

                const validUnits = ["METER", "FEET", "INCHES", "CENTIMETER", "PANHA", "RFT", "SQFT", "SQM", "SQY", "ROLL", "PIECE", "PANEL"];
                if (!validUnits.includes(unit)) {
                    unit = "PIECE";
                }

                return {
                    projectId: project.id,
                    artisanId: labour.artisanId || null,
                    productId: labour.productId,
                    price: Number(labour?.price) || 0,
                    key: labour.key,
                    quantity: Number(labour.quantity) || 0,
                    unit: unit,
                    workName: labour.workName || null,
                    labourType: labour.labourType || "STITCHING",
                };
            });

            await tx.projectLabours.deleteMany({ where: { projectId: id } });

            if (labourRows.length > 0) {
                await tx.projectLabours.createMany({
                    data: labourRows as any,
                });
            }

            return { id };
        });
    };

    updateStatus = async (id: string, status: any) => {
        await prisma.projects.update({
            where: { id },
            data: { status },
            select: { id: true }
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
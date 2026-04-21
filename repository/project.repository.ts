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
            });

            // ── 2. Project Products ───────────────────────────────────────────────
            // Source: selections.areas[].areacollection[]

            const areas: any[] = data.areas ?? [];

            const productRows = areas.flatMap((area: any) =>
                (area.areacollection ?? []).map((item: any) => ({
                    projectId: project.id,
                    productId: item.productId,
                    areaId: area.areaId || null,
                    price: Number(item.mrp ?? 0),
                    quantity: Number(item.quantity ?? 1),
                    brandId: item.companyId || null,
                    catalogueId: item._catalogueId || null,
                    designNo: Number(item.designNo ?? 0),
                    references: item.reference || null,
                    measurementUnit: item.unit || null,
                    width: item.width != null ? Number(item.width) : null,
                    height: item.height != null ? Number(item.height) : null,
                    length: item.length != null ? Number(item.length) : null,
                    orderId: null,
                    remark: item.remark || null,
                    status: "PENDING",
                }))
            );

            if (productRows.length > 0) {
                await tx.projectProducts.createMany({
                    data: productRows as any,
                });
            }

            // ── 3. Project Labours ────────────────────────────────────────────────
            // Source: selections.labourData[]

            const labourData: any[] = data.labourData ?? [];

            const labourRows = labourData.map((labour: any) => ({
                projectId: project.id,
                stitchingId: labour.stitchingId || null,
                artisanId: labour.artisanId || null,
                cost: Number(labour.labourCost ?? 0),
                key: labour.key,
                quantity: Number(labour.quantity ?? 0),
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
                projectProducts: true,
                projectLabours: true,
                payments: true,
                tasks: true
            }
        });

        return project;
    };

    markAsDefaulter = async (id: string) => {
        const project = await prisma.projects.update({
            where: { id },
            data: { status: "DEFAULTER" },
            include: {
                projectProducts: true,
                projectLabours: true,  // fix: was customProducts (doesn't exist)
                payments: true,
                tasks: true
            }
        });

        return project;
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
                projectProducts: true,
                projectLabours: true,  // added — was missing
                payments: true,
                tasks: true
            }
        });
    };

    update = async (data: any, id: string, userId?: string) => {
        try {
            return await prisma.projects.update({
                where: { id },
                data
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    delete = async (id: string, userId?: string) => {
        try {
            return await prisma.projects.delete({
                where: { id }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };
}


export { ProjectRepository };
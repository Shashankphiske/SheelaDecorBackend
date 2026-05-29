import { config } from "../config/index.js";
import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";
class ProjectRepository {
    handlePrismaError(error) {
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
    create = async (data) => {
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
                    projectDate: new Date(data.projectDate),
                    additionalRequests: data.additionalRequest,
                    address: data.address,
                    status: "PENDING",
                    creatorId: data.creatorId,
                    bankId: data.bankId,
                },
                select: {
                    id: true,
                    createdAt: true,
                    status: true,
                    paid: true,
                    creator: { select: { username: true } }
                }
            });
            // ── 2. Project Products ───────────────────────────────────────────────
            const areas = data.areas ?? [];
            const productRows = areas.flatMap((area) => (area.areacollection ?? []).map((item) => ({
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
            })));
            if (productRows.length > 0) {
                await tx.projectProducts.createMany({
                    data: productRows,
                });
            }
            // ── 3. Auto-create initial Orders for each product ────────────────────
            const orderRows = areas.flatMap((area) => (area.areacollection ?? []).map((item) => ({
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
            })));
            if (orderRows.length > 0) {
                await tx.orders.createMany({
                    data: orderRows,
                });
            }
            // ── 4. Project Labours ────────────────────────────────────────────────
            const labourData = data.labourData ?? [];
            const labourRows = labourData.map((labour) => {
                let unit = labour.unit;
                if (unit === "MTR")
                    unit = "METER";
                if (unit === "PCS")
                    unit = "PIECE";
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
                    data: labourRows,
                });
            }
            return project;
        });
    };
    fetch = async (id) => {
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
    markAsDefaulter = async (id) => {
        const project = await prisma.projects.update({
            where: { id },
            data: { status: "DEFAULTER" },
        });
        return;
    };
    fetchAll = async (data, filters, searchFields = []) => {
        const { artisanId, ...restFilters } = filters || {};
        let where = {};
        where = serverUtils.buildWhere(where, restFilters, data, searchFields);
        if (artisanId) {
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
                { createdAt: (data.sort ?? "desc") },
                { id: (data.sort ?? "desc") }
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
    update = async (data, id, userId) => {
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
                    projectDate: new Date(data.projectDate),
                    additionalRequests: data.additionalRequest,
                    address: data.address,
                    status: data.status,
                    creatorId: data.creatorId,
                    bankId: data.bankId,
                },
                select: { id: true }
            });
            // ── 2. Project Products ───────────────────────────────────────────────
            const areas = data.areas ?? [];
            const productRows = areas.flatMap((area) => (area.areacollection ?? []).map((item) => ({
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
            })));
            await tx.projectProducts.deleteMany({ where: { projectId: id } });
            if (productRows.length > 0) {
                await tx.projectProducts.createMany({
                    data: productRows,
                });
            }
            // ── 3. Auto-create initial Orders for each product ────────────────────
            const orderRows = areas.flatMap((area) => (area.areacollection ?? []).map((item) => ({
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
            })));
            await tx.orders.deleteMany({ where: { projectId: id } });
            if (orderRows.length > 0) {
                await tx.orders.createMany({
                    data: orderRows,
                });
            }
            // ── 4. Project Labours ────────────────────────────────────────────────
            const labourData = data.labourData ?? [];
            const labourRows = labourData.map((labour) => {
                let unit = labour.unit;
                if (unit === "MTR")
                    unit = "METER";
                if (unit === "PCS")
                    unit = "PIECE";
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
                    data: labourRows,
                });
            }
            return { id };
        });
    };
    updateStatus = async (id, status) => {
        await prisma.projects.update({
            where: { id },
            data: { status },
            select: { id: true }
        });
    };
    delete = async (id, userId) => {
        try {
            await prisma.projects.delete({
                where: { id }
            });
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    };
}
export { ProjectRepository };
//# sourceMappingURL=project.repository.js.map
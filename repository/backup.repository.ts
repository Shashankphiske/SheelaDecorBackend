import { prisma } from "../db/prisma.js";

export interface DateRange {
    gte: Date;
    lte: Date;
}

export class BackupRepository {
    /**
     * Fetches all monthly transactional/operational records created within the target date range.
     */
    async getMonthlyTransactionalData(dateRange: DateRange) {
        const [
            projects,
            projectProducts,
            projectLabours,
            payments,
            orders,
            tasks,
            inquiries,
            measurements,
            measurementsData,
            cataloguesGivenTo,
            stores,
            authorizations,
        ] = await Promise.all([
            // 1. Projects
            prisma.projects.findMany({
                where: { createdAt: dateRange },
                include: {
                    customer: { select: { name: true, phonenumber: true } },
                    interior: { select: { name: true } },
                    bank: { select: { bankName: true, accountNumber: true } },
                    creator: { select: { username: true } },
                },
                orderBy: { createdAt: "asc" },
            }),

            // 2. Project Products
            prisma.projectProducts.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { project: { createdAt: dateRange } },
                    ],
                } as any,
                include: {
                    project: { select: { name: true } },
                    product: { select: { name: true } },
                    brand: { select: { name: true } },
                    catalogue: { select: { name: true } },
                    area: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" } as any,
            }),

            // 3. Project Labours
            prisma.projectLabours.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { project: { createdAt: dateRange } },
                    ],
                } as any,
                include: {
                    project: { select: { name: true } },
                    product: { select: { name: true } },
                    artisan: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" } as any,
            }),

            // 4. Payments
            prisma.payments.findMany({
                where: { createdAt: dateRange },
                include: {
                    customer: { select: { name: true } },
                    project: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" },
            }),

            // 5. Orders
            prisma.orders.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { orderedDate: dateRange },
                        { receivedDate: dateRange },
                        { project: { createdAt: dateRange } },
                    ],
                } as any,
                include: {
                    customer: { select: { name: true } },
                    product: { select: { name: true } },
                    brand: { select: { name: true } },
                    catalogue: { select: { name: true } },
                    area: { select: { name: true } },
                    project: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" } as any,
            }),

            // 6. Tasks
            prisma.tasks.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { taskDate: dateRange },
                    ],
                },
                include: {
                    project: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" },
            }),

            // 7. Inquiries
            prisma.inquiries.findMany({
                where: { createdAt: dateRange },
                orderBy: { createdAt: "asc" },
            }),

            // 8. Measurements
            prisma.measurements.findMany({
                where: { createdAt: dateRange },
                orderBy: { createdAt: "asc" },
            }),

            // 9. Measurements Data
            prisma.measurementsData.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { measurements: { createdAt: dateRange } },
                    ],
                } as any,
                include: {
                    measurements: { select: { projectName: true } },
                    area: { select: { name: true } },
                    product: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" } as any,
            }),

            // 10. Catalogues Given To
            prisma.cataloguesGivenTo.findMany({
                where: {
                    OR: [
                        { createdAt: dateRange },
                        { givenDate: dateRange },
                    ],
                },
                include: {
                    catalogue: { select: { name: true } },
                },
                orderBy: { createdAt: "asc" },
            }),

            // 11. Stores
            prisma.stores.findMany({
                where: { createdAt: dateRange },
                orderBy: { createdAt: "asc" },
            }),

            // 12. Authorizations
            prisma.authorizations.findMany({
                where: { createdAt: dateRange } as any,
                include: {
                    user: { select: { username: true, email: true } },
                },
                orderBy: { createdAt: "asc" } as any,
            }),
        ]);

        return {
            projects,
            project_products: projectProducts,
            project_labours: projectLabours,
            payments,
            orders,
            tasks,
            inquiries,
            measurements,
            measurements_data: measurementsData,
            catalogues_given_to: cataloguesGivenTo,
            stores,
            authorizations,
        };
    }

    /**
     * Checks all 17 master data tables to determine which ones have records created in the target date range.
     */
    async checkMasterTablesCreatedInMonth(dateRange: DateRange) {
        const [
            areasCount,
            artisanTypesCount,
            artisansCount,
            banksCount,
            brandsCount,
            cataloguesCount,
            customersCount,
            dealersCount,
            dealsInCount,
            interiorsCount,
            machineBrandsCount,
            machineCategoriesCount,
            machinesCount,
            materialCategoriesCount,
            materialsCount,
            productsCount,
            usersCount,
        ] = await Promise.all([
            prisma.areas.count({ where: { createdAt: dateRange } }),
            prisma.artisanTypes.count({ where: { createdAt: dateRange } as any }),
            prisma.artisans.count({ where: { createdAt: dateRange } }),
            prisma.banks.count({ where: { createdAt: dateRange } }),
            prisma.brands.count({ where: { createdAt: dateRange } }),
            prisma.catalogues.count({ where: { createdAt: dateRange } }),
            prisma.customers.count({ where: { createdAt: dateRange } }),
            prisma.dealers.count({ where: { createdAt: dateRange } }),
            prisma.dealsIn.count({ where: { createdAt: dateRange } as any }),
            prisma.interiors.count({ where: { createdAt: dateRange } }),
            prisma.machineBrand.count({ where: { createdAt: dateRange } }),
            prisma.machineCategory.count({ where: { createdAt: dateRange } }),
            prisma.machine.count({ where: { createdAt: dateRange } }),
            prisma.materialCategory.count({ where: { createdAt: dateRange } }),
            prisma.material.count({ where: { createdAt: dateRange } }),
            prisma.products.count({ where: { createdAt: dateRange } }),
            prisma.users.count({ where: { createdAt: dateRange } }),
        ]);

        return {
            areas: areasCount,
            artisan_types: artisanTypesCount,
            artisans: artisansCount,
            banks: banksCount,
            brands: brandsCount,
            catalogues: cataloguesCount,
            customers: customersCount,
            dealers: dealersCount,
            deals_in: dealsInCount,
            interiors: interiorsCount,
            machine_brands: machineBrandsCount,
            machine_categories: machineCategoriesCount,
            machines: machinesCount,
            material_categories: materialCategoriesCount,
            materials: materialsCount,
            products: productsCount,
            users: usersCount,
        };
    }

    /**
     * Fetches complete dataset for specified master data tables to sync with Master Data Backup.
     */
    async getMasterTableData(tableNames: string[]) {
        const tableSet = new Set(tableNames);
        const result: Record<string, any[]> = {};

        const loaders: Promise<void>[] = [];

        if (tableSet.has("areas")) {
            loaders.push(
                prisma.areas.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["areas"] = data;
                })
            );
        }

        if (tableSet.has("artisan_types")) {
            loaders.push(
                prisma.artisanTypes.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["artisan_types"] = data;
                })
            );
        }

        if (tableSet.has("artisans")) {
            loaders.push(
                prisma.artisans
                    .findMany({
                        include: { artisanType: { select: { name: true } } },
                        orderBy: { name: "asc" },
                    })
                    .then((data) => {
                        result["artisans"] = data;
                    })
            );
        }

        if (tableSet.has("banks")) {
            loaders.push(
                prisma.banks.findMany({ orderBy: { bankName: "asc" } }).then((data) => {
                    result["banks"] = data;
                })
            );
        }

        if (tableSet.has("brands")) {
            loaders.push(
                prisma.brands.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["brands"] = data;
                })
            );
        }

        if (tableSet.has("catalogues")) {
            loaders.push(
                prisma.catalogues
                    .findMany({
                        include: { brand: { select: { name: true } } },
                        orderBy: { name: "asc" },
                    })
                    .then((data) => {
                        result["catalogues"] = data;
                    })
            );
        }

        if (tableSet.has("customers")) {
            loaders.push(
                prisma.customers.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["customers"] = data;
                })
            );
        }

        if (tableSet.has("dealers")) {
            loaders.push(
                prisma.dealers
                    .findMany({
                        include: { DealsIn: { select: { name: true } } },
                        orderBy: { name: "asc" },
                    })
                    .then((data) => {
                        result["dealers"] = data;
                    })
            );
        }

        if (tableSet.has("deals_in")) {
            loaders.push(
                prisma.dealsIn.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["deals_in"] = data;
                })
            );
        }

        if (tableSet.has("interiors")) {
            loaders.push(
                prisma.interiors.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["interiors"] = data;
                })
            );
        }

        if (tableSet.has("machine_brands")) {
            loaders.push(
                prisma.machineBrand.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["machine_brands"] = data;
                })
            );
        }

        if (tableSet.has("machine_categories")) {
            loaders.push(
                prisma.machineCategory.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["machine_categories"] = data;
                })
            );
        }

        if (tableSet.has("machines")) {
            loaders.push(
                prisma.machine
                    .findMany({
                        include: {
                            category: { select: { name: true } },
                            brand: { select: { name: true } },
                        },
                        orderBy: { name: "asc" },
                    })
                    .then((data) => {
                        result["machines"] = data;
                    })
            );
        }

        if (tableSet.has("material_categories")) {
            loaders.push(
                prisma.materialCategory.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["material_categories"] = data;
                })
            );
        }

        if (tableSet.has("materials")) {
            loaders.push(
                prisma.material
                    .findMany({
                        include: { category: { select: { name: true } } },
                        orderBy: { name: "asc" },
                    })
                    .then((data) => {
                        result["materials"] = data;
                    })
            );
        }

        if (tableSet.has("products")) {
            loaders.push(
                prisma.products.findMany({ orderBy: { name: "asc" } }).then((data) => {
                    result["products"] = data;
                })
            );
        }

        if (tableSet.has("users")) {
            loaders.push(
                prisma.users
                    .findMany({
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true,
                            phonenumber: true,
                            alternatePhonenumber: true,
                            address: true,
                            createdAt: true,
                        },
                        orderBy: { username: "asc" },
                    })
                    .then((data) => {
                        result["users"] = data;
                    })
            );
        }

        await Promise.all(loaders);
        return result;
    }
}

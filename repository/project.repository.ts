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

    create = async (projectData: ProjectData, productsData: any, customProductsData: any ) => {
        return await prisma.$transaction(async (tx) => {

            const project = await tx.projects.create({
                data: projectData
            });

            // 1. Map the standard products to include the new project ID
            const productsToInsert = productsData.map((p: any) => ({
                ...p,
                projectId: project.id // Attach the foreign key
            }));

            // 2. Map the custom products to include the new project ID
            const customProductsToInsert = customProductsData.map((cp: any) => ({
                ...cp,
                projectId: project.id // Attach the foreign key
            }));

            // 3. Execute the bulk inserts
            const projectProducts = await tx.projectProducts.createManyAndReturn({
                data: productsToInsert
            });
            return {...project, projectProducts};
        });
    }

    fetch = async (id: string) => {
        const project = await prisma.products.findFirst({
            where: {
                id,
                status: {
                    not: "DEFAULTER"
                }
            },
            include: {
                projectProducts: true,
                payments: true,
                tasks: true
            }
        });

        return project;
    }

    markAsDefaulter = async (id: string) => {
        const project = await prisma.projects.update({
            where: {
                id
            },
            data: {
                status: "DEFAULTER"
            },
            include: {
                projectProducts: true,
                customProducts: true,
                payments: true,
                tasks: true
            }
        });

        return project;
    }

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []): Promise<any> => {

        let where: any = {
        };

        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await prisma.projects.findMany({
            take: data.limit ?? 10,
            where,
            orderBy: [
                { createdAt: (data.sort ?? "desc") as 'asc' | 'desc' },
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                projectProducts: true,
                payments: true,
                tasks: true   
            }
        });
    };

    update = async (data: any, id: string, userId?: string) => {
        try {
            const where: any = {
                id
            };

            return await prisma.projects.update({
                where,
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
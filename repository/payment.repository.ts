import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { Payment, PaymentData } from "../dto/payment.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class PaymentRepository extends BaseRepository<Payment, PaymentData, any> {
    constructor() {
        super(prisma.payments, "PAYMENT");
    }

    create = async (data: PaymentData) => {
        try {
            return await prisma.$transaction(async (tx) => {
                await tx.projects.update({
                    where: {
                        id: data.projectId,
                    },
                    data: {
                        paid: {
                            // Use a ternary to select the correct Prisma action
                            [data.type === "CREDIT" ? "increment" : "decrement"]: data.amount,
                        },
                    },
                });

                return await this.model.create({
                    data,
                    select: {
                        id: true,
                        ...(this.config.hasCreatedAt !== false ? { createdAt: true } : {}),
                    }
                });
            })
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    fetch = async (id: string, userId?: string) => {

        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where,
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                project: {
                    select: {
                        name: true
                    }
                }
            },
        });
        return record ?? ({} as Payment);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") as 'asc' | 'desc' }]
                    : []
                ),
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                customer: {
                    select: {
                        name: true
                    }
                },
                project: {
                    select: {
                        name: true
                    }
                }
            },
        });
    };

    update = async (data: PaymentData, id: string, userId?: string) => {

        return await prisma.$transaction(async (tx) => {
            await tx.projects.update({
                where: {
                    id: data.projectId,
                },
                data: {
                    paid: {
                        [data.type === "CREDIT" ? "increment" : "decrement"]: data.amount,
                    },
                },
            });

            try {
                const where: any = {
                    [this.config.primaryKey]: id,
                    ...(userId ? { userId } : {})
                };

                if (this.config.statusField) {
                    where[this.config.statusField] = null;
                }

                await this.model.update({
                    where,
                    data,
                });
            } catch (error) {
                this.handlePrismaError(error);
            }
        })
    };

    hardDelete = async (id: string, userId?: string) => {
        return await prisma.$transaction(async (tx) => {
            try {
                const payment = await this.model.delete({
                    where: { [this.config.primaryKey]: id, ...(userId ? { userId } : {}) }
                });

                await tx.projects.update({
                    where: {
                        id: payment.projectId
                    },
                    data: {
                        paid: {
                            [payment.type === "CREDIT" ? "decrement" : "increment"]: payment.amount,
                        },   
                    }
                })
            } catch (error) {
                this.handlePrismaError(error);
            }
        })
    };
}

export { PaymentRepository }
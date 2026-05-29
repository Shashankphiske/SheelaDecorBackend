import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";
class PaymentRepository extends BaseRepository {
    constructor() {
        super(prisma.payments, "PAYMENT");
    }
    create = async (data) => {
        try {
            return await prisma.$transaction(async (tx) => {
                if (data.projectId) {
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
                }
                return await tx.payments.create({
                    data,
                    select: {
                        id: true,
                        ...(this.config.hasCreatedAt !== false ? { createdAt: true } : {}),
                    }
                });
            });
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    };
    fetch = async (id, userId) => {
        const where = {
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
        return record ?? {};
    };
    fetchAll = async (data, filters, searchFields = []) => {
        let where = {};
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") }]
                    : []),
                { id: (data.sort ?? "desc") }
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
    update = async (data, id, userId) => {
        return await prisma.$transaction(async (tx) => {
            try {
                // Find the existing payment to revert its values first
                const oldPayment = await tx.payments.findUnique({
                    where: { id }
                });
                if (oldPayment && oldPayment.projectId) {
                    await tx.projects.update({
                        where: {
                            id: oldPayment.projectId,
                        },
                        data: {
                            paid: {
                                [oldPayment.type === "CREDIT" ? "decrement" : "increment"]: oldPayment.amount,
                            },
                        },
                    });
                }
                // Apply the new payment values
                if (data.projectId) {
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
                }
                const where = {
                    [this.config.primaryKey]: id,
                    ...(userId ? { userId } : {})
                };
                if (this.config.statusField) {
                    where[this.config.statusField] = null;
                }
                await tx.payments.update({
                    where: where,
                    data: data,
                });
            }
            catch (error) {
                this.handlePrismaError(error);
            }
        });
    };
    hardDelete = async (id, userId) => {
        return await prisma.$transaction(async (tx) => {
            try {
                const payment = await tx.payments.delete({
                    where: { [this.config.primaryKey]: id, ...(userId ? { userId } : {}) }
                });
                if (payment && payment.projectId) {
                    await tx.projects.update({
                        where: {
                            id: payment.projectId
                        },
                        data: {
                            paid: {
                                [payment.type === "CREDIT" ? "decrement" : "increment"]: payment.amount,
                            },
                        }
                    });
                }
            }
            catch (error) {
                this.handlePrismaError(error);
            }
        });
    };
}
export { PaymentRepository };
//# sourceMappingURL=payment.repository.js.map
import type { Measurement } from "../dto/measurement.dto.js";
import { BaseRepository } from "./base.repository.js";
import { prisma } from "../db/prisma.js";

class MeasurementRepository extends BaseRepository<Measurement, any, any>{
    constructor(){
        super(prisma.measurements, "MEASUREMENTS")
    }

    create = async (data: any): Promise<any> => {
        try {
            const { projectName, measurementData } = data;

            // Create parent measurements record
            const measurement = await prisma.measurements.create({
                data: {
                    projectName,
                },
                select: {
                    id: true,
                    createdAt: true
                }
            });

            // Create child measurementsData records
            if (measurementData && Array.isArray(measurementData) && measurementData.length > 0) {
                await prisma.measurementsData.createMany({
                    data: measurementData.map((d: any) => ({
                        measurementId: measurement.id,
                        areaId: d.areaId,
                        productId: d.productId,
                        length: d.length !== undefined && d.length !== null ? d.length : null,
                        width: d.width !== undefined && d.width !== null ? d.width : null,
                        height: d.height !== undefined && d.height !== null ? d.height : null,
                        unit: d.unit || 'METER',
                    }))
                });
            }

            return measurement;
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    update = async (data: any, id: string, userId?: string): Promise<any> => {
        try {
            const { measurementData } = data;
            if (measurementData && Array.isArray(measurementData)) {
                // Find all existing ids that we want to keep
                const keepIds = measurementData.filter((d: any) => d.id).map((d: any) => d.id);

                await prisma.$transaction(async (tx) => {
                    // Delete removed records
                    await tx.measurementsData.deleteMany({
                        where: {
                            measurementId: id,
                            id: {
                                notIn: keepIds
                            }
                        }
                    });

                    // Update existing or create new ones
                    for (const d of measurementData) {
                        if (d.id) {
                            // Update existing record
                            await tx.measurementsData.update({
                                where: { id: d.id },
                                data: {
                                    areaId: d.areaId,
                                    productId: d.productId,
                                    length: d.length !== undefined && d.length !== null ? d.length : null,
                                    width: d.width !== undefined && d.width !== null ? d.width : null,
                                    height: d.height !== undefined && d.height !== null ? d.height : null,
                                    unit: d.unit || 'METER',
                                }
                            });
                        } else {
                            // Create new record
                            await tx.measurementsData.create({
                                data: {
                                    measurementId: id,
                                    areaId: d.areaId,
                                    productId: d.productId,
                                    length: d.length !== undefined && d.length !== null ? d.length : null,
                                    width: d.width !== undefined && d.width !== null ? d.width : null,
                                    height: d.height !== undefined && d.height !== null ? d.height : null,
                                    unit: d.unit || 'METER',
                                }
                            });
                        }
                    }
                });
            }
            return { id };
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    fetch = async (id: string, userId?: string): Promise<any> => {
        try {
            const record = await prisma.measurements.findFirst({
                where: { id },
                include: {
                    measurementsData: {
                        include: {
                            area: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            if (!record) return {} as any;
            return {
                ...record,
                measurementData: record.measurementsData
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    hardDelete = async (id: string, userId?: string): Promise<any> => {
        try {
            await prisma.measurementsData.deleteMany({
                where: { measurementId: id }
            });
            const record = await prisma.measurements.delete({
                where: { id }
            });
            return record;
        } catch (error) {
            this.handlePrismaError(error);
        }
    };
}

export { MeasurementRepository }
import { prisma } from "../db/prisma.js";
import type { Payment, PaymentData } from "../dto/payment.dto.js";
import { BaseRepository } from "./base.repository.js";

class PaymentRepository extends BaseRepository<Payment, PaymentData, any> {
    constructor() {
        super(prisma.payments, "PAYMENT");
    }
}

export { PaymentRepository }
import type { Payment, PaymentData } from "../dto/payment.dto.js";
import type { PaymentRepository } from "../repository/payment.repository.js";
import { BaseService } from "./base.service.js";

class PaymentService extends BaseService<Payment, PaymentData, any> {
    constructor(methods: PaymentRepository) {
        super(methods, "PAYMENT");
    }
}

export { PaymentService }
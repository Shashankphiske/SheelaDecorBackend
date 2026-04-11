import type { Customer, CustomerData } from "../dto/customer.dto.js";
import type { CustomerRepository } from "../repository/customer.repository.js";
import { BaseService } from "./base.service.js";

class CustomerService extends BaseService<Customer, CustomerData, any> {
    constructor(methods: CustomerRepository) {
        super(methods, "CUSTOMER");
    }
}

export { CustomerService }
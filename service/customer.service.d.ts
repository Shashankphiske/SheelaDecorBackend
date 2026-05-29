import type { Customer, CustomerData } from "../dto/customer.dto.js";
import type { CustomerRepository } from "../repository/customer.repository.js";
import { BaseService } from "./base.service.js";
declare class CustomerService extends BaseService<Customer, CustomerData, any> {
    constructor(methods: CustomerRepository);
}
export { CustomerService };
//# sourceMappingURL=customer.service.d.ts.map
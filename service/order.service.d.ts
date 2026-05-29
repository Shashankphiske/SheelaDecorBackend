import type { Order, OrderData } from "../dto/order.dto.js";
import type { OrderRepository } from "../repository/order.repository.js";
import { BaseService } from "./base.service.js";
declare class OrderService extends BaseService<Order, OrderData, any> {
    constructor(methods: OrderRepository);
}
export { OrderService };
//# sourceMappingURL=order.service.d.ts.map
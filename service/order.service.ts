import type { Order, OrderData } from "../dto/order.dto.js";
import type { OrderRepository } from "../repository/order.repository.js";
import { BaseService } from "./base.service.js";

class OrderService extends BaseService<Order, OrderData, any> {
    constructor(methods: OrderRepository) {
        super(methods, "ORDER");
    }
}

export { OrderService };
import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { OrderRepository } from "../repository/order.repository.js";
import { OrderService } from "../service/order.service.js";
import { OrderController } from "../controller/order.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(OrderRepository, OrderService, OrderController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as OrderRouter }
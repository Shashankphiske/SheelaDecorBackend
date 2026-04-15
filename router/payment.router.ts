import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { PaymentRepository } from "../repository/payment.repository.js";
import { PaymentService } from "../service/payment.service.js";
import { PaymentController } from "../controller/payment.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(PaymentRepository, PaymentService, PaymentController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as PaymentRouter }
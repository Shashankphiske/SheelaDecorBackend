import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { BankRepository } from "../repository/banks.repository.js";
import { BankService } from "../service/bank.service.js";
import { BankController } from "../controller/bank.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(BankRepository, BankService, BankController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as BankRouter };
import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { DealsInRepository } from "../repository/dealsIn.repository.js";
import { DealsInService } from "../service/dealsIn.service.js";
import { DealsInController } from "../controller/dealsIn.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(DealsInRepository, DealsInService, DealsInController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as DealsInRouter }
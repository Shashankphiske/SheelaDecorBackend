import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { DealerRepository } from "../repository/dealer.repository.js";
import { DealerService } from "../service/dealer.service.js";
import { DealerController } from "../controller/dealer.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(DealerRepository, DealerService, DealerController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as DealerRouter }
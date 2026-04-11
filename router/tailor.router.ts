import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { TailorRepository } from "../repository/tailor.repository.js";
import { TailorService } from "../service/tailor.service.js";
import { TailorController } from "../controller/tailor.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(TailorRepository, TailorService, TailorController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as TailorRouter }
import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { MachineCategoryRepository } from "../repository/machineCategory.repository.js";
import { MachineCategoryService } from "../service/machineCategory.service.js";
import { MachineCategoryController } from "../controller/machineCategory.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(MachineCategoryRepository, MachineCategoryService, MachineCategoryController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as MachineCategoryRouter };

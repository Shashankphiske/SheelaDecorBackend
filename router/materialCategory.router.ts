import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { MaterialCategoryRepository } from "../repository/materialCategory.repository.js";
import { MaterialCategoryService } from "../service/materialCategory.service.js";
import { MaterialCategoryController } from "../controller/materialCategory.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(MaterialCategoryRepository, MaterialCategoryService, MaterialCategoryController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/bulk", errorHandler.wrapper(controller.createMany));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as MaterialCategoryRouter };

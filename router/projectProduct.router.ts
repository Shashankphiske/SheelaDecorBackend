import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProjectProductRepository } from "../repository/projectProduct.repository.js";
import { ProjectProductService } from "../service/projectProduct.service.js";
import { ProjectProductController } from "../controller/projectProduct.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProjectProductRepository, ProjectProductService, ProjectProductController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));


export { router as ProjectProductRouter }
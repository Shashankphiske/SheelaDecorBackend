import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { CatalogueRepository } from "../repository/catalogue.repository.js";
import { CatalogueService } from "../service/catalogue.service.js";
import { CatalogueController } from "../controller/catalogue.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(CatalogueRepository, CatalogueService, CatalogueController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as CatalogueRouter };
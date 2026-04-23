import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ArtisanTypeRepository } from "../repository/artisanType.repository.js";
import { ArtisanTypeService } from "../service/artisanType.service.js";
import { ArtisanTypeController } from "../controller/artisanType.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ArtisanTypeRepository, ArtisanTypeService, ArtisanTypeController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ArtisanTypeRouter };
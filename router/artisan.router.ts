import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ArtisanService } from "../service/artisan.service.js";
import { ArtisanRepository } from "../repository/artisan.repository.js";
import { ArtisanController } from "../controller/artisan.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ArtisanRepository, ArtisanService, ArtisanController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ArtisanRouter }
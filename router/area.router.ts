import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { AreaRepository } from "../repository/area.repository.js";
import { AreaService } from "../service/area.service.js";
import { AreaController } from "../controller/area.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(AreaRepository, AreaService, AreaController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as AreaRouter };
import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { StitchingRepository } from "../repository/stitching.repository.js";
import { StitchingService } from "../service/stitching.service.js";
import { StitchingController } from "../controller/stitching.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(StitchingRepository, StitchingService, StitchingController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as StitchingRouter };
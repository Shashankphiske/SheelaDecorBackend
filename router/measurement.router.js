import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { MeasurementRepository } from "../repository/measurement.repository.js";
import { MeasurementService } from "../service/measurement.service.js";
import { MeasurementController } from "../controller/measurement.controller.js";
import { errorHandler } from "../factory/error.factory.js";
const router = express.Router();
const controller = GeneralFactory.create(MeasurementRepository, MeasurementService, MeasurementController);
router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll));
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));
export { router as MeasurementRouter };
//# sourceMappingURL=measurement.router.js.map
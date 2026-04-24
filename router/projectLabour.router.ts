import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProjectLabourRepository } from "../repository/projectLabour.repository.js";
import { ProjectLabourService } from "../service/projectLabour.service.js";
import { ProjectLabourController } from "../controller/projectLabour.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProjectLabourRepository, ProjectLabourService, ProjectLabourController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ProjectLabourRouter }
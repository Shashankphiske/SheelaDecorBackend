import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ReportRespository } from "../repository/report.repository.js";
import { ReportService } from "../service/report.service.js";
import { ReportController } from "../controller/report.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ReportRespository, ReportService, ReportController);

router.get("/", errorHandler.wrapper(controller.fetchDashData));

export { router as ReportRouter }
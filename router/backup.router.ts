import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { BackupRepository } from "../repository/backup.repository.js";
import { BackupService } from "../service/backup.service.js";
import { BackupController } from "../controller/backup.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(BackupRepository, BackupService, BackupController);

// Public/Key-authenticated cron endpoint
router.get("/monthly-cron", errorHandler.wrapper(controller.monthlyCron));

// Protected admin/settings endpoints
router.get("/preview", errorHandler.wrapper(controller.previewMonthBackup));
router.post("/run", errorHandler.wrapper(controller.runBackup));
router.get("/download", errorHandler.wrapper(controller.downloadExport));
router.get("/history", errorHandler.wrapper(controller.getHistory));

export { router as BackupRouter, controller as backupController };

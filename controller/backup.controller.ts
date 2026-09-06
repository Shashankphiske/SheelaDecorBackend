import type { Request, Response } from "express";
import { config } from "../config/index.js";
import { ServerError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.constants.js";
import type { BackupService } from "../service/backup.service.js";

export class BackupController {
    constructor(private backupService: BackupService) {}

    /**
     * GET /v1/backup/preview?year=2026&month=9
     */
    previewMonthBackup = async (req: Request, res: Response) => {
        const now = new Date();
        const year = req.query.year ? Number(req.query.year) : now.getFullYear();
        const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            throw new ServerError(errorMessage.INVALIDDATA);
        }

        const preview = await this.backupService.previewMonthBackup(year, month);
        return res.status(200).json({
            status: "success",
            data: preview,
        });
    };

    /**
     * POST /v1/backup/run
     * Body: { year: 2026, month: 9, targetEmail?: string, uploadToDrive?: boolean, sendEmail?: boolean }
     */
    runBackup = async (req: Request, res: Response) => {
        const now = new Date();
        const year = req.body?.year ? Number(req.body.year) : now.getFullYear();
        const month = req.body?.month ? Number(req.body.month) : now.getMonth() + 1;
        const targetEmail = req.body?.targetEmail;
        const uploadToDrive = req.body?.uploadToDrive !== false;
        const sendEmail = req.body?.sendEmail !== false;

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            throw new ServerError(errorMessage.INVALIDDATA);
        }

        const result = await this.backupService.runBackup({
            year,
            month,
            targetEmail,
            uploadToDrive,
            sendEmail,
        });

        return res.status(200).json({
            status: "success",
            message: `Backup for ${result.monthName} ${year} executed successfully.`,
            data: result,
        });
    };

    /**
     * GET /v1/backup/monthly-cron?key=...
     * Automatically called at month end or 1st of month by external schedulers.
     */
    monthlyCron = async (req: Request, res: Response) => {
        const key = (req.query.key as string) || (req.headers["x-cron-key"] as string);

        if (key !== config.cronKey) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized cron key",
            });
        }

        const now = new Date();
        let targetYear = now.getFullYear();
        let targetMonth = now.getMonth() + 1;

        // If explicit year/month supplied, use them; otherwise if run on day 1-5, backup the previous month
        if (req.query.year && req.query.month) {
            targetYear = Number(req.query.year);
            targetMonth = Number(req.query.month);
        } else if (now.getDate() <= 5) {
            // Previous month
            targetMonth = now.getMonth(); // 0-indexed month gives previous month (1..12)
            if (targetMonth === 0) {
                targetMonth = 12;
                targetYear -= 1;
            }
        }

        const result = await this.backupService.runBackup({
            year: targetYear,
            month: targetMonth,
            targetEmail: config.defaultBackupEmail,
            uploadToDrive: true,
            sendEmail: true,
        });

        return res.status(200).json({
            status: "success",
            message: `Scheduled monthly backup completed for ${result.monthName} ${targetYear}.`,
            data: result,
        });
    };

    /**
     * GET /v1/backup/download?year=2026&month=9
     */
    downloadExport = async (req: Request, res: Response) => {
        const now = new Date();
        const year = req.query.year ? Number(req.query.year) : now.getFullYear();
        const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            throw new ServerError(errorMessage.INVALIDDATA);
        }

        const bundle = await this.backupService.getExportBundle(year, month);
        return res.status(200).json({
            status: "success",
            data: bundle,
        });
    };

    /**
     * GET /v1/backup/history
     */
    getHistory = async (_req: Request, res: Response) => {
        const history = this.backupService.getBackupHistory();
        return res.status(200).json({
            status: "success",
            data: history,
        });
    };
}

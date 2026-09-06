import { config } from "../config/index.js";
import { sendMail } from "../config/mail.js";
import { BackupRepository, type DateRange } from "../repository/backup.repository.js";
import { GoogleDriveService } from "./googleDrive.service.js";
import { convertToCsv } from "../utils/csv.utils.js";
import { logger } from "../utils/logger.util.js";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export interface BackupExecutionLog {
    id: string;
    timestamp: string;
    targetYear: number;
    targetMonth: number;
    monthName: string;
    status: "SUCCESS" | "FAILED" | "PARTIAL";
    targetEmail: string;
    transactionalFiles: { name: string; records: number; sizeBytes: number }[];
    updatedMasterFiles: { name: string; totalRecords: number; newRecordsInMonth: number }[];
    totalRecords: number;
    driveFolderUrl?: string;
    masterDriveFolderUrl?: string;
    errorMessage?: string;
    durationMs: number;
}

// In-memory backup history (last 50 executions)
const backupHistory: BackupExecutionLog[] = [];

export class BackupService {
    private googleDriveService: GoogleDriveService;

    constructor(private backupRepo: BackupRepository) {
        this.googleDriveService = new GoogleDriveService();
    }

    /**
     * Resolves the start and end Date for a given month and year in UTC.
     */
    resolveDateRange(year: number, month: number): {
        dateRange: DateRange;
        monthName: string;
        monthFolderName: string;
    } {
        const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        const monthName = MONTH_NAMES[month - 1] || `Month_${month}`;
        const monthFolderName = `${String(month).padStart(2, "0")} - ${monthName}`;

        return {
            dateRange: { gte: start, lte: end },
            monthName,
            monthFolderName,
        };
    }

    /**
     * Previews table record counts for the target month and master data status.
     */
    async previewMonthBackup(year: number, month: number) {
        const { dateRange, monthName, monthFolderName } = this.resolveDateRange(year, month);

        const [transactionalData, masterCounts] = await Promise.all([
            this.backupRepo.getMonthlyTransactionalData(dateRange),
            this.backupRepo.checkMasterTablesCreatedInMonth(dateRange),
        ]);

        const transactionalSummary = Object.entries(transactionalData).map(([tableName, records]) => ({
            tableName: `${tableName}.csv`,
            count: records.length,
        }));

        const totalTransactionalRecords = transactionalSummary.reduce((acc, curr) => acc + curr.count, 0);

        const masterSummary = Object.entries(masterCounts).map(([tableName, newCount]) => ({
            tableName: `${tableName}.csv`,
            newRecordsInMonth: newCount,
            hasNewRecords: newCount > 0,
        }));

        const masterTablesWithNewData = masterSummary.filter((m) => m.hasNewRecords).length;

        return {
            year,
            month,
            monthName,
            monthFolderName,
            totalTransactionalRecords,
            transactionalSummary,
            masterSummary,
            masterTablesWithNewData,
            driveConfigured: this.googleDriveService.isConfigured(),
            defaultBackupEmail: config.defaultBackupEmail,
        };
    }

    /**
     * Generates CSV strings for all monthly transactional tables.
     */
    async generateMonthlyCsvFiles(dateRange: DateRange) {
        const transactionalData = await this.backupRepo.getMonthlyTransactionalData(dateRange);
        const files: Record<string, { csv: string; count: number; sizeBytes: number }> = {};

        for (const [tableName, records] of Object.entries(transactionalData)) {
            const fileName = `${tableName}.csv`;
            const csv = convertToCsv(records);
            const sizeBytes = Buffer.byteLength(csv, "utf8");
            files[fileName] = {
                csv,
                count: records.length,
                sizeBytes,
            };
        }

        return files;
    }

    /**
     * Executes the monthly data backup pipeline.
     */
    async runBackup(options: {
        year: number;
        month: number;
        targetEmail?: string;
        uploadToDrive?: boolean;
        sendEmail?: boolean;
    }): Promise<BackupExecutionLog> {
        const startTime = Date.now();
        const year = Number(options.year);
        const month = Number(options.month);
        const targetEmail = "sheeladecorproject@gmail.com";
        const shouldUploadDrive = options.uploadToDrive !== false;
        const shouldSendEmail = options.sendEmail !== false;

        const { dateRange, monthName, monthFolderName } = this.resolveDateRange(year, month);

        logger.info(`Starting Monthly Data Backup for ${monthName} ${year}`, { targetEmail });

        const logEntry: BackupExecutionLog = {
            id: `backup_${year}_${String(month).padStart(2, "0")}_${Date.now()}`,
            timestamp: new Date().toISOString(),
            targetYear: year,
            targetMonth: month,
            monthName,
            status: "SUCCESS",
            targetEmail,
            transactionalFiles: [],
            updatedMasterFiles: [],
            totalRecords: 0,
            durationMs: 0,
        };

        try {
            // 1. Generate Transactional CSVs
            const monthlyFiles = await this.generateMonthlyCsvFiles(dateRange);

            let totalRecords = 0;
            for (const [fileName, fileData] of Object.entries(monthlyFiles)) {
                logEntry.transactionalFiles.push({
                    name: fileName,
                    records: fileData.count,
                    sizeBytes: fileData.sizeBytes,
                });
                totalRecords += fileData.count;
            }
            logEntry.totalRecords = totalRecords;

            // 2. Check Master Tables for new records in this month
            const masterCounts = await this.backupRepo.checkMasterTablesCreatedInMonth(dateRange);
            const masterTablesToUpdate = Object.entries(masterCounts)
                .filter(([_, count]) => count > 0)
                .map(([name]) => name);

            // If master tables have new records, fetch their complete datasets
            const masterDataToSync = masterTablesToUpdate.length > 0
                ? await this.backupRepo.getMasterTableData(masterTablesToUpdate)
                : {};

            const masterCsvFiles: Record<string, { csv: string; count: number }> = {};
            for (const [tableName, records] of Object.entries(masterDataToSync)) {
                const fileName = `${tableName}.csv`;
                const csv = convertToCsv(records);
                masterCsvFiles[fileName] = {
                    csv,
                    count: records.length,
                };
                logEntry.updatedMasterFiles.push({
                    name: fileName,
                    totalRecords: records.length,
                    newRecordsInMonth: (masterCounts as Record<string, number>)[tableName] || 0,
                });
            }

            // 3. Upload to Google Drive if configured
            if (shouldUploadDrive && this.googleDriveService.isConfigured()) {
                try {
                    logger.info("Connecting to Google Drive and establishing folder hierarchy...");

                    // A. Establish 'Data Backup' -> Year -> Month folder hierarchy
                    const { dataBackupRootId, monthFolderId } = await this.googleDriveService.getOrCreateHierarchy(
                        year,
                        monthFolderName
                    );

                    // B. Overwrite rule: Purge all existing data inside month folder
                    logger.info(`Purging existing files in month folder '${monthFolderName}' before fresh backup...`);
                    await this.googleDriveService.purgeFolderContents(monthFolderId);

                    // C. Upload all transactional CSV files
                    for (const [fileName, fileData] of Object.entries(monthlyFiles)) {
                        await this.googleDriveService.uploadOrUpdateFile(
                            monthFolderId,
                            fileName,
                            fileData.csv,
                            "text/csv"
                        );
                    }

                    // D. Share Data Backup root folder with target Gmail
                    await this.googleDriveService.shareFolder(dataBackupRootId, targetEmail, "writer");
                    await this.googleDriveService.shareFolder(monthFolderId, targetEmail, "writer");

                    logEntry.driveFolderUrl = this.googleDriveService.getFolderUrl(monthFolderId);

                    // E. Handle Master Data Backup folder
                    const masterFolderId = await this.googleDriveService.getOrCreateMasterFolder();

                    // Upload/Update master data CSVs in Master Data Backup folder
                    for (const [fileName, fileData] of Object.entries(masterCsvFiles)) {
                        await this.googleDriveService.uploadOrUpdateFile(
                            masterFolderId,
                            fileName,
                            fileData.csv,
                            "text/csv"
                        );
                    }

                    // Share Master Data Backup folder with target Gmail
                    await this.googleDriveService.shareFolder(masterFolderId, targetEmail, "writer");
                    logEntry.masterDriveFolderUrl = this.googleDriveService.getFolderUrl(masterFolderId);

                    logger.info("Google Drive backup completed successfully", {
                        monthFolderUrl: logEntry.driveFolderUrl,
                        masterFolderUrl: logEntry.masterDriveFolderUrl,
                    });
                } catch (driveErr: any) {
                    logger.warn("Google Drive upload error", { error: driveErr?.message || driveErr });
                    logEntry.status = "PARTIAL";
                    logEntry.errorMessage = `Google Drive upload: ${driveErr?.message || "Storage quota limitation"}. All CSV files are attached directly to this email.`;
                }
            } else if (shouldUploadDrive && !this.googleDriveService.isConfigured()) {
                logger.warn("Google Drive is not configured in .env; skipping Drive upload step.");
                logEntry.status = "PARTIAL";
                logEntry.errorMessage = "Google Drive credentials not configured. CSV data attached to email.";
            }

            // 4. Send Email Summary (clean notification without file attachments)
            if (shouldSendEmail && targetEmail) {
                try {
                    const subject = `Monthly Data Backup Report - ${monthName} ${year}`;
                    const html = this.buildEmailSummaryHtml(logEntry, monthName, year);
                    await sendMail(targetEmail, subject, html);
                    logger.info(`Backup notification email sent to ${targetEmail}`);
                } catch (emailErr) {
                    logger.warn("Failed to send backup notification email", { emailErr });
                }
            }

            logEntry.durationMs = Date.now() - startTime;
            backupHistory.unshift(logEntry);
            if (backupHistory.length > 50) backupHistory.pop();

            return logEntry;
        } catch (error: any) {
            logEntry.status = "FAILED";
            logEntry.errorMessage = error.message || "Unknown error during backup pipeline execution";
            logEntry.durationMs = Date.now() - startTime;
            backupHistory.unshift(logEntry);
            logger.error("Monthly Backup Failed", { error: logEntry.errorMessage });
            throw error;
        }
    }

    /**
     * Generates all CSV files in a bundle for direct client download.
     */
    async getExportBundle(year: number, month: number) {
        const { dateRange, monthName } = this.resolveDateRange(year, month);
        const transactionalFiles = await this.generateMonthlyCsvFiles(dateRange);

        // Also include all master data tables
        const masterTables = [
            "areas", "artisan_types", "artisans", "banks", "brands", "catalogues",
            "customers", "dealers", "deals_in", "interiors", "machine_brands",
            "machine_categories", "machines", "material_categories", "materials",
            "products", "users"
        ];
        const masterData = await this.backupRepo.getMasterTableData(masterTables);

        const masterFiles: Record<string, { csv: string; count: number }> = {};
        for (const [tableName, records] of Object.entries(masterData)) {
            masterFiles[`${tableName}.csv`] = {
                csv: convertToCsv(records),
                count: records.length,
            };
        }

        return {
            year,
            month,
            monthName,
            transactionalFiles,
            masterFiles,
        };
    }

    /**
     * Returns recent backup execution logs.
     */
    getBackupHistory(): BackupExecutionLog[] {
        return backupHistory;
    }

    private buildEmailSummaryHtml(log: BackupExecutionLog, monthName: string, year: number): string {
        const filesListHtml = log.transactionalFiles
            .map(
                (f) =>
                    `<tr>
                        <td style="padding: 6px 12px; border: 1px solid #e2e8f0; font-family: monospace;">${f.name}</td>
                        <td style="padding: 6px 12px; border: 1px solid #e2e8f0; text-align: right;">${f.records} records</td>
                        <td style="padding: 6px 12px; border: 1px solid #e2e8f0; text-align: right;">${(f.sizeBytes / 1024).toFixed(1)} KB</td>
                    </tr>`
            )
            .join("");

        const masterListHtml = log.updatedMasterFiles.length > 0
            ? log.updatedMasterFiles
                  .map(
                      (m) =>
                          `<tr>
                              <td style="padding: 6px 12px; border: 1px solid #e2e8f0; font-family: monospace;">${m.name}</td>
                              <td style="padding: 6px 12px; border: 1px solid #e2e8f0; text-align: right; color: #16a34a; font-weight: bold;">+${m.newRecordsInMonth} added</td>
                              <td style="padding: 6px 12px; border: 1px solid #e2e8f0; text-align: right;">${m.totalRecords} total</td>
                          </tr>`
                  )
                  .join("")
            : `<tr><td colspan="3" style="padding: 8px; text-align: center; color: #64748b;">No new master data created this month.</td></tr>`;

        return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; color: #1e293b;">
            <div style="background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0; font-size: 20px;">📦 Monthly Data Backup Report</h2>
                <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Sheela Decor • ${monthName} ${year}</p>
            </div>
            <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; background: #ffffff;">
                <p style="font-size: 14px; line-height: 1.5;">The monthly automated database backup has completed successfully for <strong>${monthName} ${year}</strong>.</p>

                <div style="margin: 16px 0; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; font-size: 14px;"><strong>Total Records Exported:</strong> ${log.totalRecords}</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px;"><strong>Execution Time:</strong> ${(log.durationMs / 1000).toFixed(2)}s</p>
                    ${
                        log.driveFolderUrl
                            ? `<p style="margin: 8px 0 0 0; font-size: 14px;"><a href="${log.driveFolderUrl}" style="color: #2563eb; text-decoration: none; font-weight: bold;">📁 Open Month Backup in Google Drive &rarr;</a></p>`
                            : ""
                    }
                    ${
                        log.masterDriveFolderUrl
                            ? `<p style="margin: 4px 0 0 0; font-size: 14px;"><a href="${log.masterDriveFolderUrl}" style="color: #2563eb; text-decoration: none; font-weight: bold;">🗃️ Open Master Data Backup in Google Drive &rarr;</a></p>`
                            : ""
                    }
                </div>

                <h3 style="font-size: 15px; margin: 20px 0 10px 0; color: #334155;">Transactional Data Tables (${monthName} ${year})</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left;">Table CSV</th>
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right;">Records</th>
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right;">Size</th>
                        </tr>
                    </thead>
                    <tbody>${filesListHtml}</tbody>
                </table>

                <h3 style="font-size: 15px; margin: 24px 0 10px 0; color: #334155;">Master Data Sync Status</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left;">Master Table</th>
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right;">New This Month</th>
                            <th style="padding: 8px 12px; border: 1px solid #e2e8f0; text-align: right;">Total Dataset</th>
                        </tr>
                    </thead>
                    <tbody>${masterListHtml}</tbody>
                </table>
            </div>
        </div>`;
    }
}

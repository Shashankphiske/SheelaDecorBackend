import dotenv from "dotenv";
import path from "path";

if (typeof process !== "undefined" && process.versions?.node) {
    dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`) });
    dotenv.config();
}

interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string;
    databaseUrl: string;
    redisUrl: string;
    cronKey: string;
    googleClientEmail: string;
    googlePrivateKey: string;
    googleDriveParentFolderId: string;
    defaultBackupEmail: string;
}

const config: Config = {
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET || "sheeladecor",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    redisUrl: process.env.REDIS_URL ?? "",
    cronKey: process.env.CRON_KEY ?? "cronjobvalue",
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL ?? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "",
    googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    googleDriveParentFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ?? process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID ?? "",
    defaultBackupEmail: "sheeladecorproject@gmail.com"
};

export { config };


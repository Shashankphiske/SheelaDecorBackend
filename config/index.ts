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
    get port() { return Number(process.env.PORT || 4000); },
    get jwtSecret() { return process.env.JWT_SECRET || "sheeladecor"; },
    get directDbConnection() { return process.env.DIRECT_URL ?? ""; },
    get databaseUrl() { return process.env.DATABASE_URL ?? ""; },
    get redisUrl() { return process.env.REDIS_URL ?? ""; },
    get cronKey() { return process.env.CRON_KEY ?? "cronjobvalue"; },
    get googleClientEmail() { return (process.env.GOOGLE_CLIENT_EMAIL ?? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "").trim(); },
    get googlePrivateKey() {
        let key = (process.env.GOOGLE_PRIVATE_KEY ?? "").trim();
        if (key.startsWith('"') && key.endsWith('"')) {
            key = key.slice(1, -1);
        }
        return key.replace(/\\n/g, "\n");
    },
    get googleDriveParentFolderId() { return (process.env.GOOGLE_DRIVE_FOLDER_ID ?? process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID ?? "").trim(); },
    get defaultBackupEmail() { return "sheeladecorproject@gmail.com"; }
};

export { config };



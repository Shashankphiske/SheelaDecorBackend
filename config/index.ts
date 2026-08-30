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
}

const config: Config = {
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET || "sheeladecor",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    redisUrl: process.env.REDIS_URL ?? "",
    cronKey: process.env.CRON_KEY ?? ""
};

export { config };


import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
});

interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string
    databaseUrl: string
    redisUrl: string
}

const config: Config = {
    port: Number(process.env.PORT || 0),
    jwtSecret: process.env.JWT_SECRET ?? "",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    redisUrl: process.env.REDIS_URL ?? ""
}

export { config };
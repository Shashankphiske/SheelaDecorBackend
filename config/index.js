import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
});
const config = {
    port: Number(process.env.PORT || 0),
    jwtSecret: process.env.JWT_SECRET ?? "",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    redisUrl: process.env.REDIS_URL ?? "",
    cronKey: process.env.CRON_KEY ?? ""
};
export { config };
//# sourceMappingURL=index.js.map
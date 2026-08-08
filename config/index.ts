// In Cloudflare Workers, env vars come from wrangler.toml [vars] or Cloudflare dashboard secrets.
// dotenv is not used here — no filesystem access in the Workers runtime.

interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string
    databaseUrl: string
    redisUrl: string
    cronKey: string
}

const config: Config = {
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET ?? "",
    directDbConnection: process.env.DIRECT_URL ?? "",
    databaseUrl: process.env.DATABASE_URL ?? "",
    redisUrl: process.env.REDIS_URL ?? "",
    cronKey: process.env.CRON_KEY ?? ""
}

export { config };


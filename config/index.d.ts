interface Config {
    port: number;
    jwtSecret: string;
    directDbConnection: string;
    databaseUrl: string;
    redisUrl: string;
    cronKey: string;
}
declare const config: Config;
export { config };
//# sourceMappingURL=index.d.ts.map
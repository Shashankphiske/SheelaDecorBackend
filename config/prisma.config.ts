import "dotenv/config";
import { defineConfig } from "prisma/config";
import { config } from "./index.js";

const prismaConfig = defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: config.directDbConnection
    }
})

export { prismaConfig };
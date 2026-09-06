import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { httpServerHandler } from "cloudflare:node";

import { config } from "./config/index.js";
import { logger } from "./utils/logger.util.js";
import { globalErrorHandler, errorHandler } from "./factory/error.factory.js";
import { authenticate, authenticateAdmin, authorizePage } from "./middleware/authenticate.middleware.js";

import { UserRouter } from "./router/user.router.js";
import { AuthRouter } from "./router/auth.router.js";
import { BrandRouter } from "./router/brand.router.js";
import { ArtisanRouter } from "./router/artisan.router.js";
import { ArtisanTypeRouter } from "./router/artisanType.router.js";
import { ProductRouter } from "./router/product.router.js";
import { CatalogueRouter } from "./router/catalogue.router.js";
import { AreaRouter } from "./router/area.router.js";
import { TaskRouter } from "./router/task.router.js";
import { ProjectRouter } from "./router/project.router.js";
import { ProjectLabourRouter } from "./router/projectLabour.router.js";
import { ProjectProductRouter } from "./router/projectProduct.router.js";
import { BankRouter } from "./router/bank.router.js";
import { CustomerRouter } from "./router/customer.router.js";
import { InteriorRouter } from "./router/interior.router.js";
import { InquiryRouter } from "./router/inquiry.router.js";
import { PaymentRouter } from "./router/payment.router.js";
import { AuthorizationRouter } from "./router/authorization.router.js";
import { DealerRouter } from "./router/dealer.router.js";
import { DealsInRouter } from "./router/dealsIn.router.js";
import { OrderRouter } from "./router/order.router.js";
import { ReportRouter } from "./router/report.router.js";
import { MeasurementRouter } from "./router/measurement.router.js";
import { CataloguesGivenToRouter } from "./router/cataloguesGivenTo.router.js";
import { MachineCategoryRouter } from "./router/machineCategory.router.js";
import { MachineBrandRouter } from "./router/machineBrand.router.js";
import { MachineRouter } from "./router/machine.router.js";
import { MaterialCategoryRouter } from "./router/materialCategory.router.js";
import { MaterialRouter } from "./router/material.router.js";
import { BackupRouter, backupController } from "./router/backup.router.js";
import { BackupRepository } from "./repository/backup.repository.js";
import { BackupService } from "./service/backup.service.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const stream = {
    write: (message: string) => logger.info(message.trim())
};

const corsOptions = {
  origin: ['http://localhost:5173', 'https://project-sheela-dash.lovable.app', "https://sheeladecorfrontend.netlify.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-cron-key'],
  credentials: true,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(morgan(`:method :url :response-time ms`, { stream }));

// Dedicated monthly backup cron entrypoint (key-authenticated, public before JWT auth)
app.get("/v1/backup/monthly-cron", errorHandler.wrapper(backupController.monthlyCron));

// Define a dedicated endpoint instead of overloading the root "/"
app.get("/", (req: Request, res: Response) => {
    const key = req.query.key || req.headers["x-cron-key"];

    if (key === config.cronKey) {
        return res.status(200).json({
            status: "success",
            message: "Cron verified and executed successfully."
        });
    }

    return res.status(200).json({
        status: "idle",
        message: "Server is awake, but no cron key was provided."
    });
});

app.use("/v1/users", UserRouter);
app.use("/v1/auth", AuthRouter);

app.use(authenticate);

app.use("/v1/backup", authorizePage("settings"), BackupRouter);
app.use("/v1/brands", authorizePage("brands"), BrandRouter);
app.use("/v1/artisans", authorizePage("artisans"), ArtisanRouter);
app.use("/v1/artisantypes", authorizePage("artisans"), ArtisanTypeRouter);
app.use("/v1/products", authorizePage("products"), ProductRouter);
app.use("/v1/catalogues", authorizePage("catalogues"), CatalogueRouter);
app.use("/v1/areas", authorizePage("areas"), AreaRouter);
app.use("/v1/tasks", authorizePage("tasks"), TaskRouter);
app.use("/v1/projects", authorizePage("projects"), ProjectRouter);
app.use("/v1/projectlabours", authorizePage("projects"), ProjectLabourRouter);
app.use("/v1/projectproducts", authorizePage("projects"), ProjectProductRouter);
app.use("/v1/banks", authorizePage("banks"), BankRouter);
app.use("/v1/customers", authorizePage("customers"), CustomerRouter);
app.use("/v1/interiors", authorizePage("interiors"), InteriorRouter);
app.use("/v1/inquiries", authorizePage("dashboard"), InquiryRouter);
app.use("/v1/payments", authorizePage("payments"), PaymentRouter);
app.use("/v1/dealers", authorizePage("dealers"), DealerRouter);
app.use("/v1/dealsin", authorizePage("dealers"), DealsInRouter);
app.use("/v1/orders", authorizePage("orders"), OrderRouter);
app.use("/v1/measurements", authorizePage("measurements"), MeasurementRouter);
app.use("/v1/reports", authorizePage("reports"), ReportRouter);
app.use("/v1/cataloguesgivento", authorizePage("cataloguesgivento"), CataloguesGivenToRouter);
app.use("/v1/machinecategories", authorizePage("machineStock"), MachineCategoryRouter);
app.use("/v1/machinebrands", authorizePage("machineStock"), MachineBrandRouter);
app.use("/v1/machines", authorizePage("machineStock"), MachineRouter);
app.use("/v1/materialcategories", authorizePage("materialStock"), MaterialCategoryRouter);
app.use("/v1/materials", authorizePage("materialStock"), MaterialRouter);
app.use("/v1/authorizations", authorizePage("settings"), AuthorizationRouter);

app.use(globalErrorHandler.handleError);

const port = Number(config.port || 4000);

app.listen(port, "0.0.0.0", () => {
    console.log(`App listening on port : ${port}`);
});

const nodeHandler = httpServerHandler({ port }) as {
    fetch: (request: any, env?: any, ctx?: any) => Promise<any> | any;
};

export default {
    fetch: (request: any, env: any, ctx: any) => {
        if (env && typeof env === "object") {
            Object.assign(process.env, env);
        }
        return nodeHandler.fetch(request, env, ctx);
    },
    async scheduled(event: any, env: any, ctx: any) {
        if (env && typeof env === "object") {
            Object.assign(process.env, env);
        }
        ctx.waitUntil(
            (async () => {
                try {
                    logger.info("Cloudflare Cron Trigger fired for Monthly Backup", { cron: event.cron });
                    const backupRepo = new BackupRepository();
                    const backupService = new BackupService(backupRepo);
                    const now = new Date();
                    let targetYear = now.getFullYear();
                    let targetMonth = now.getMonth(); // 0-indexed month gives previous month (1..12)
                    if (targetMonth === 0) {
                        targetMonth = 12;
                        targetYear -= 1;
                    }
                    const result = await backupService.runBackup({
                        year: targetYear,
                        month: targetMonth,
                        targetEmail: config.defaultBackupEmail,
                        uploadToDrive: true,
                        sendEmail: true,
                    });
                    logger.info("Scheduled backup completed successfully", { result });
                } catch (err) {
                    logger.error("Error executing scheduled backup via Cloudflare Cron", { err });
                }
            })()
        );
    },
};



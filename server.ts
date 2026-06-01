import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { config } from "./config/index.js";
import { UserRouter } from "./router/user.router.js";
import { logger } from "./utils/logger.util.js";
import morgan from "morgan";
import { globalErrorHandler } from "./factory/error.factory.js";
import { cacheMiddleware } from "./middleware/cache.middleware.js";
import { AuthRouter } from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import { BrandRouter } from "./router/brand.router.js";
import { ArtisanRouter } from "./router/artisan.router.js";
import { ProductRouter } from "./router/product.router.js";
import { CatalogueRouter } from "./router/catalogue.router.js";
import { AreaRouter } from "./router/area.router.js";
import { TaskRouter } from "./router/task.router.js";
import { ProjectRouter } from "./router/project.router.js";
import { BankRouter } from "./router/bank.router.js";
import { CustomerRouter } from "./router/customer.router.js";
import { InquiryRouter } from "./router/inquiry.router.js";
import cors from "cors";
import { PaymentRouter } from "./router/payment.router.js";
import { AuthorizationRouter } from "./router/authorization.router.js";
import { authenticate, authenticateAdmin, authorizePage } from "./middleware/authenticate.middleware.js";
import { DealerRouter } from "./router/dealer.router.js";
import { DealsInRouter } from "./router/dealsIn.router.js";
import { ArtisanTypeRouter } from "./router/artisanType.router.js";
import { ProjectLabourRouter } from "./router/projectLabour.router.js";
import { ProjectProductRouter } from "./router/projectProduct.router.js";
import { OrderRouter } from "./router/order.router.js";
import { ReportRouter } from "./router/report.router.js";
import { MeasurementRouter } from "./router/measurement.router.js";
import { CataloguesGivenToRouter } from "./router/cataloguesGivenTo.router.js";
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
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Required if you are using cookies or sessions
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(morgan(`:method :url :response-time ms`, { stream }) );


// Define a dedicated endpoint instead of overloading the root "/"
app.get("/", (req: Request, res: Response) => {
    // Check for the key in both query parameters and custom headers
    const key = req.query.key || req.headers["x-cron-key"];

    // 1. Authenticated Cron Traffic: The key matches
    if (key === config.cronKey) {
        // Do any light background tasks here if needed (e.g., clear temp cache)
        return res.status(200).json({
            status: "success",
            message: "Cron verified and executed successfully."
        });
    }

    // 2. Unauthenticated Traffic: Someone else or a generic uptime bot hit the URL
    // We return 200 OK so the ping service counts it as a "Success",
    // but we return an empty/idle message so no server resources are wasted.
    return res.status(200).json({
        status: "idle",
        message: "Server is awake, but no cron key was provided."
    });
});


app.use("/v1/users", UserRouter);
app.use("/v1/auth", AuthRouter);

app.use(authenticate);

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

app.use("/v1/inquiries", authorizePage("dashboard"), InquiryRouter);

app.use("/v1/payments", authorizePage("payments"), PaymentRouter);

app.use("/v1/dealers", authorizePage("dealers"), DealerRouter);

app.use("/v1/dealsin", authorizePage("dealers"), DealsInRouter);

app.use("/v1/orders", authorizePage("orders"), OrderRouter);

app.use("/v1/measurements", authorizePage("measurements"), MeasurementRouter);

app.use("/v1/reports", authorizePage("reports"), ReportRouter);

app.use("/v1/cataloguesgivento", authorizePage("cataloguesgivento"), CataloguesGivenToRouter);

app.use("/v1/authorizations", authorizePage("settings"), AuthorizationRouter);

app.use(globalErrorHandler.handleError);

app.listen(config.port, "0.0.0.0",() => {
    console.log(`App listening on port : ${config.port}`);
});

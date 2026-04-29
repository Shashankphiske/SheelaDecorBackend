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
import { authenticate, authenticateAdmin } from "./middleware/authenticate.middleware.js";
import { DealerRouter } from "./router/dealer.router.js";
import { DealsInRouter } from "./router/dealsIn.router.js";
import { ArtisanTypeRouter } from "./router/artisanType.router.js";
import { ProjectLabourRouter } from "./router/projectLabour.router.js";
import { ProjectProductRouter } from "./router/projectProduct.router.js";
import { OrderRouter } from "./router/order.router.js";
import { ReportRouter } from "./router/report.router.js";
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

// app.use(cacheMiddleware.cacheRequest(3600, "PRIVATE"));

app.get("/", (req: Request, res: Response) => {
    // Check key in URL: ://yoursite.com
    const key = req.query.key || req.headers["x-cron-key"];

    if (key === config.cronKey) {
        return res.status(200).send("OK");
    }

    // Still return 200 but with a different message to keep the cron "Success" 
    // OR keep 401/403 for security (just ensure your cron service sends the key)
    return res.status(401).send("Unauthorized");
});


app.use("/v1/users", UserRouter);
app.use("/v1/auth", AuthRouter);

app.use(authenticate);

app.use("/v1/brands", BrandRouter);
app.use("/v1/artisans", ArtisanRouter);
app.use("/v1/artisantypes", ArtisanTypeRouter);

app.use("/v1/products", ProductRouter);

app.use("/v1/catalogues", CatalogueRouter);

app.use("/v1/areas", AreaRouter);

app.use("/v1/tasks", TaskRouter);

app.use("/v1/projects", ProjectRouter);
app.use("/v1/projectlabours", ProjectLabourRouter);
app.use("/v1/projectproducts", ProjectProductRouter);

app.use("/v1/banks", BankRouter);

app.use("/v1/customers", CustomerRouter);

app.use("/v1/inquiries", InquiryRouter);

app.use("/v1/payments", PaymentRouter);

app.use("/v1/dealers", DealerRouter);

app.use("/v1/dealsin", DealsInRouter);

app.use("/v1/orders", OrderRouter);

app.use(authenticateAdmin);

app.use("/v1/reports", ReportRouter);

app.use("/v1/authorizations", AuthorizationRouter);

app.use(globalErrorHandler.handleError);

app.listen(config.port, "0.0.0.0",() => {
    console.log(`App listening on port : ${config.port}`);
});

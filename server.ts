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
import { TailorRouter } from "./router/tailor.router.js";
import { ProductRouter } from "./router/product.router.js";
import { CatalogueRouter } from "./router/catalogue.router.js";
import { AreaRouter } from "./router/area.router.js";
import { TaskRouter } from "./router/task.router.js";
import { ProjectRouter } from "./router/project.router.js";
import { BankRouter } from "./router/bank.router.js";
import { CustomerRouter } from "./router/customer.router.js";
import { StitchingRouter } from "./router/stitching.router.js";
import { InquiryRouter } from "./router/inquiry.router.js";
import cors from "cors";
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

app.use("/v1/user", UserRouter);
app.use("/v1/auth", AuthRouter);

app.use("/v1/brands", BrandRouter);
app.use("/v1/tailors", TailorRouter);

app.use("/v1/products", ProductRouter);

app.use("/v1/catalogues", CatalogueRouter);

app.use("/v1/areas", AreaRouter);

app.use("/v1/tasks", TaskRouter);

app.use("/v1/projects", ProjectRouter);

app.use("/v1/banks", BankRouter);

app.use("/v1/customers", CustomerRouter);

app.use("/v1/stitching", StitchingRouter);

app.use("/v1/inquiries", InquiryRouter);

app.get("/", (req: Request, res: Response) => {
    if(req.headers["x-cron-key"] == config.cronKey) {
        return res.status(200).json({
            success: true,
            message: "Service authenticated"
        });
    }

    return res.status(400).json({
        success: false,
        message: "Service unauthorized"
    });
})

app.use(globalErrorHandler.handleError);

app.listen(config.port, "0.0.0.0",() => {
    console.log(`App listening on port : ${config.port}`);
});

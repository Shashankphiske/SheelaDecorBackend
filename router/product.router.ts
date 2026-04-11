import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { ProductRepository } from "../repository/product.repository.js";
import { ProductService } from "../service/product.service.js";
import { ProductController } from "../controller/product.controller.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = GeneralFactory.create(ProductRepository, ProductService, ProductController);

router.get("/:id", errorHandler.wrapper(controller.fetch));
router.get("/", errorHandler.wrapper(controller.fetchAll))
router.post("/", errorHandler.wrapper(controller.create));
router.patch("/:id", errorHandler.wrapper(controller.update));
router.delete("/:id", errorHandler.wrapper(controller.delete));

export { router as ProductRouter }
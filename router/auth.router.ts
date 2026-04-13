import express from "express";
import { AuthFactory } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/error.factory.js";

const router = express.Router();
const controller = AuthFactory.create();

router.get("/", errorHandler.wrapper(controller.fetchState));

router.post("/", errorHandler.wrapper(controller.login));
router.delete("/:flag", errorHandler.wrapper(controller.logout));

export { router as AuthRouter };
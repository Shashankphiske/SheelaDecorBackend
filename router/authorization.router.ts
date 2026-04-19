import express from "express";
import { GeneralFactory } from "../factory/general.factory.js";
import { AuthorizationRepository } from "../repository/authorization.repository.js";
import { AuthorizationService } from "../service/authorization.service.js";
import { AuthorizationController } from "../controller/authorization.controller.js";

const router = express.Router();
const controller = GeneralFactory.create(AuthorizationRepository, AuthorizationService, AuthorizationController);

export { router as AuthorizationRouter }
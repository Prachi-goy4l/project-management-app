import express from "express";
import { createOrganization } from "./organization.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",  authMiddleware,createOrganization);

export default router;
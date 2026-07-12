import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "./organization.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrganization);

router.get("/", getOrganizations);

router.get("/:id", getOrganizationById);

router.put("/:id", updateOrganization);

router.delete("/:id", deleteOrganization);

export default router;
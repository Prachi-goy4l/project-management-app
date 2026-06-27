import express from "express";
import { createProject, getProjects } from "./project.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { organizationMiddleware } from "../../middlewares/organization.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  organizationMiddleware(["Owner", "Admin"]),
  createProject,
);

router.get(
  "/organization/:organizationId",
  authMiddleware,
  organizationMiddleware(),
  getProjects
);

export default router;

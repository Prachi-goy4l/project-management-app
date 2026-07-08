import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { projectMiddleware } from "../../middlewares/project.middleware.js";
import { organizationMiddleware } from "../../middlewares/organization.middleware.js";
import { getOverview, getRecentTasks,getProjectDashboard } from "./dashboard.controller.js";

const router = express.Router();

router.get(
  "/overview/:organizationId",
  authMiddleware,
  organizationMiddleware(),
  getOverview
);
router.get(
  "/recent-tasks/:organizationId",
  authMiddleware,
  organizationMiddleware(),
  getRecentTasks
);
router.get(
  "/project/:projectId",
  authMiddleware,
  projectMiddleware(),
  getProjectDashboard
);

export default router;
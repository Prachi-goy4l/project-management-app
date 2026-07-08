import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import organizationRoutes from "../modules/organizations/organization.routes.js";
import inviteRoutes from "../modules/invites/invite.routes.js";
import projectRoutes from "../modules/projects/project.routes.js";
import taskRoutes from "../modules/tasks/task.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/organizations", organizationRoutes);

router.use("/invites", inviteRoutes);

router.use("/projects", projectRoutes);

router.use("/tasks", taskRoutes);

router.use("/dashboard", dashboardRoutes);

export default router;
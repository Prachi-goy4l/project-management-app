import express from "express";
import { createProject, getProjects,getProjectById,updateProject,archiveProject,addProjectMember,removeProjectMember } from "./project.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { organizationMiddleware } from "../../middlewares/organization.middleware.js";
import { projectMiddleware } from "../../middlewares/project.middleware.js";

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

router.get(
  "/:projectId",
  authMiddleware,
  projectMiddleware(),
  getProjectById
);

router.put(
  "/:projectId",
  authMiddleware,
  projectMiddleware(),
  updateProject
);

router.patch(
    "/:projectId/archive",
    authMiddleware,
    projectMiddleware(),
    archiveProject
);

router.post(
  "/:projectId/members",
  authMiddleware,
  projectMiddleware(),
  addProjectMember
);

router.delete(
  "/:projectId/members/:memberId",
  authMiddleware,
  projectMiddleware(),
  removeProjectMember
);
export default router;

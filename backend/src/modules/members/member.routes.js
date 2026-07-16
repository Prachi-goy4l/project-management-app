import express from "express";

import { getOrganizationMembers } from "./member.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/:organizationId",
  authMiddleware,
  getOrganizationMembers
);

export default router;
import express from "express";
import {
  inviteMember,
  acceptInvite,
  getOrganizationInvites,
  deleteInvite,
} from "./invite.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:organizationId/invite", authMiddleware, inviteMember);

router.get("/:organizationId", authMiddleware, getOrganizationInvites);

router.delete("/:inviteId", authMiddleware, deleteInvite);

router.post("/accept/:token", authMiddleware, acceptInvite);

export default router;

import express from "express";
import {
  inviteMember,
  acceptInvite
} from "./invite.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:organizationId/invite", authMiddleware, inviteMember);

router.post("/accept/:token", authMiddleware, acceptInvite);

export default router;
import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import organizationRoutes from "../modules/organizations/organization.routes.js";
import inviteRoutes from "../modules/invites/invite.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/organizations", organizationRoutes);

// Invite routes
router.use("/invites", inviteRoutes);

export default router;
import crypto from "crypto";
import Invite from "../invites/invite.model.js";
import Member from "../members/members.model.js";

// Create invite
export const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { organizationId } = req.params;

    const token = crypto.randomBytes(32).toString("hex");

    const invite = await Invite.create({
      email,
      role,
      organizationId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${token}`;

    res.status(201).json({
      success: true,
      inviteLink,
      invite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Accept invite
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await Invite.findOne({
      token,
      status: "Pending",
    });
    if (invite.expiresAt < new Date()) {
      invite.status = "Expired";
      await invite.save();

      return res.status(400).json({
        success: false,
        message: "Invite has expired",
      });
    }

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite",
      });
    }
    const existingMember = await Member.findOne({
      userId: req.user.id,
      organizationId: invite.organizationId,
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this organization",
      });
    }

    await Member.create({
      userId: req.user.id,
      organizationId: invite.organizationId,
      role: invite.role,
    });

    invite.status = "Accepted";
    await invite.save();

    res.status(200).json({
      success: true,
      message: "Invite accepted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get organization invites
export const getOrganizationInvites = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const invites = await Invite.find({
      organizationId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invites.length,
      data: invites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete invite
export const deleteInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invite not found",
      });
    }

    await invite.deleteOne();

    res.status(200).json({
      success: true,
      message: "Invite deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import Organization from "../modules/organizations/organization.model.js";
import Member from "../modules/members/members.model.js";

export const organizationMiddleware =
  (allowedRoles = []) =>
  async (req, res, next) => {
    try {
      const organizationId =
        req.params.organizationId ||
        req.body.organizationId;

      if (!organizationId) {
        return res.status(400).json({
          success: false,
          message: "Organization ID is required",
        });
      }

      const organization =
        await Organization.findById(organizationId);

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }

      const member = await Member.findOne({
        organizationId,
        userId: req.user.id,
      });

      if (!member) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this organization",
        });
      }

      // Role Check
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(member.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to perform this action.",
        });
      }

      req.organization = organization;
      req.member = member;

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
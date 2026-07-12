import Organization from "../organizations/organization.model.js";
import Member from "../members/members.model.js";

// Create Organization
export const createOrganization = async (req, res) => {
  try {
    const { name, industry } = req.body;

    const organization = await Organization.create({
      name,
      industry,
      owner: req.user.id,
    });

    await Member.create({
      userId: req.user.id,
      organizationId: organization._id,
      role: "Owner",
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Organizations
export const getOrganizations = async (req, res) => {
  try {
    const memberships = await Member.find({
      userId: req.user.id,
    });

    const organizationIds = memberships.map(
      (member) => member.organizationId
    );

    const organizations = await Organization.find({
      _id: { $in: organizationIds },
    }).populate("owner", "name email");

    return res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Organization By Id
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const membership = await Member.findOne({
      organizationId: organization._id,
      userId: req.user.id,
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Organization
export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    organization.name = req.body.name ?? organization.name;
    organization.industry = req.body.industry ?? organization.industry;

    await organization.save();

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Organization
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Member.deleteMany({
      organizationId: organization._id,
    });

    await organization.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import Organization from "../organizations/organization.model.js";
import Member from "../members/members.model.js";

export const createOrganization = async (req, res) => {
  try {
    const { name, industry } = req.body;

    const organization = await Organization.create({
      name,
      industry,
      owner: req.user.id,
    });

    // Create owner membership
    await Member.create({
      userId: req.user.id,
      organizationId: organization._id,
      role: "Owner",
    });

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import Member from "./members.model.js";

export const getOrganizationMembers = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const members = await Member.find({
      organizationId, 
    })
      .populate("userId", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
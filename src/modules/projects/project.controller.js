import Project from "./project.model.js";
import Organization from "../organizations/organization.model.js";
import Member from "../members/members.model.js";

//createProject
export const createProject = async (req, res) => {
  try {
    //Read Request Body
    const { name, description, organizationId, startDate, endDate } = req.body;

    if (!name || !organizationId) {
      return res.status(400).json({
        success: false,
        message: "Project name and organization are required",
      });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Create the Project
    const project = await Project.create({
      name,
      description,
      organizationId: req.organization._id,
      createdBy: req.user.id,
      members: [req.member._id],
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all projects
export const getProjects = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const projects = await Project.find({
      organizationId,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate({
        path: "members",
        populate: {
          path: "userId",
          select: "name email",
        },
      });
      res.status(200).json({
  success: true,
  count: projects.length,
  data: projects,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

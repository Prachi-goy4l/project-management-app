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

//get project by id - particluar project
export const getProjectById = async (req, res) => {
  try {
    const project = await req.project.populate([
      {
        path: "createdBy",
        select: "name email",
      },
      {
        path: "members",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update project 
export const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      status,
    } = req.body;

    const project = req.project;

    if (
      startDate &&
      endDate &&
      new Date(endDate) < new Date(startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (status) project.status = status;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//archieve project
export const archiveProject = async (req, res) => {
  try {
    const project = req.project;

    if (project.status === "Archived") {
      return res.status(400).json({
        success: false,
        message: "Project is already archived",
      });
    }

    project.status = "Archived";

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Add project members
export const addProjectMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = req.project;

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (
      member.organizationId.toString() !==
      project.organizationId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Member belongs to another organization",
      });
    }

    if (
      project.members.some(
        (id) => id.toString() === member._id.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Member is already assigned to this project",
      });
    }

    project.members.push(member._id);

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: project,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//remove project member
export const removeProjectMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const project = req.project;

    const exists = project.members.some(
      (id) => id.toString() === memberId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Member is not assigned to this project",
      });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== memberId
    );

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: project,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
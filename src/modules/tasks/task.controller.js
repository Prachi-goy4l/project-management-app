import Task from "./task.model.js";
import Member from "../members/members.model.js";
import Project from "../projects/project.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const project = req.project;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    const task = await Task.create({
      title,
      description,
      projectId: project._id,
      createdBy: req.user.id,
      priority,
      dueDate,
    });
    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const project = req.project;
    const tasks = await Task.find({
      projectId: project._id,
      archived: false,
    })
      .populate("createdBy", "name email")
      .populate({
        path: "assignedTo",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await req.task.populate([
      {
        path: "createdBy",
        select: "name email",
      },
      {
        path: "assignedTo",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
      {
        path: "projectId",
        select: "name status",
      },
    ]);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = req.task;
    const { title, description, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (
      task.startDate &&
      dueDate &&
      new Date(dueDate) < new Date(task.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before project start date",
      });
    }
    await task.save();
    const updatedTask = await task.populate([
      {
        path: "createdBy",
        select: "name email",
      },
      {
        path: "assignedTo",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
      {
        path: "projectId",
        select: "name status",
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTask = async (req, res) => {
  try {
    const task = req.task;
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    const project = await Project.findById(task.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    if (
      project.organizationId.toString() !== member.organizationId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Member does not belong to this organization",
      });
    }
    task.assignedTo = member._id;

    await task.save();

    await task.populate([
      {
        path: "assignedTo",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = req.task;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }
    const validStatus = ["Todo", "In Progress", "Done"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
    task.status = status;

    await task.save();
    await task.populate([
      {
        path: "assignedTo",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const archiveTask = async (req, res) => {
  try {
    const task = req.task;
    task.archived = true;
    await task.save();
    return res.status(200).json({
  success: true,
  message: "Task archived successfully",
});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
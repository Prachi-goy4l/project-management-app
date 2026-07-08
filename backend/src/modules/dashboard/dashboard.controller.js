import Project from "../projects/project.model.js";
import Task from "../tasks/task.model.js";

export const getOverview = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Get all project IDs for this organization
    const projectList = await Project.find({
      organizationId,
    }).select("_id");

    const projectIds = projectList.map((project) => project._id);

    // Aggregate task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          archived: false,
        },
      },
      {
        $group: {
          _id: null,

          totalTasks: {
            $sum: 1,
          },

          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
            },
          },

          pendingTasks: {
            $sum: {
              $cond: [{ $ne: ["$status", "Done"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = taskStats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        projects: projectList.length,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        pendingTasks: stats.pendingTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentTasks = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const projectList = await Project.find({
      organizationId,
    }).select("_id");

    const projectIds = projectList.map((project) => project._id);
    const recentTasks = await Task.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
          archived: false,
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          project: "$project.name",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    return res.status(200).json({
      success: true,
      data: recentTasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectDashboard = async (req, res) => {
  try {
    const project = req.project;
    const stats = await Task.aggregate([
      {
        $match: {
          projectId: project._id,
          archived: false,
        },
      },
      {
        $group: {
          _id: null,

          totalTasks: {
            $sum: 1,
          },

          todo: {
            $sum: {
              $cond: [{ $eq: ["$status", "Todo"] }, 1, 0],
            },
          },

          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },

          done: {
            $sum: {
              $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
            },
          },
        },
      },
    ]);
    const data = stats[0] || {
      totalTasks: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    const completionPercentage =
      data.totalTasks === 0
        ? 0
        : Number(((data.done / data.totalTasks) * 100).toFixed(2));

    return res.status(200).json({
      success: true,
      data: {
        project: project.name,
        totalTasks: data.totalTasks,
        todo: data.todo,
        inProgress: data.inProgress,
        done: data.done,
        completionPercentage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

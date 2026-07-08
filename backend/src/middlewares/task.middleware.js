import Task from "../modules/tasks/task.model.js";
import Member from "../modules/members/members.model.js";
import Project from "../modules/projects/project.model.js";

export const taskMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
      if (task.archived) {
  return res.status(404).json({
    success: false,
    message: "Task not found",
  });
}
const project = await Project.findById(task.projectId);
const member = await Member.findOne({
  organizationId: project.organizationId,
  userId: req.user.id,
});

if (!member) {
  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
}
req.task = task;
next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

import Project from "../modules/projects/project.model.js";
import Member from "../modules/members/members.model.js";
export const projectMiddleware = () => {
  return async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

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

      req.project = project;
      req.member = member;

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

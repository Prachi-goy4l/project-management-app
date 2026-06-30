import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { projectMiddleware } from "../../middlewares/project.middleware.js";
import { taskMiddleware } from "../../middlewares/task.middleware.js";
import { createTask, getTasks, getTaskById, updateTask,assignTask,updateTaskStatus,archiveTask } from "./task.controller.js";

const router = express.Router();

router.post(
  "/:projectId",
  authMiddleware,
  projectMiddleware(),
  createTask
);

router.get(
  "/project/:projectId",
  authMiddleware,
  projectMiddleware(),
  getTasks
);

router.get(
  "/:taskId",
  authMiddleware,
  taskMiddleware(),
  getTaskById
);

router.patch(
  "/:taskId",
  authMiddleware,
  taskMiddleware(),
  updateTask
);

router.patch(
    "/:taskId/assign",
    authMiddleware,
    taskMiddleware(),
    assignTask
)

router.patch(
    "/:taskId/status",
    authMiddleware,
    taskMiddleware(),
    updateTaskStatus
)
router.patch(
    "/:taskId/archive",
    authMiddleware,
    taskMiddleware(),
    archiveTask
)
export default router;
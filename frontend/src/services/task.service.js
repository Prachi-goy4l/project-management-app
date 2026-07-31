import api from "../api/axios";

export const getTasks = async (projectId) => {
  const response = await api.get(
    `/tasks/project/${projectId}`
  );

  return response.data;
};

export const createTask = async (projectId, taskData) => {
  const response = await api.post(
    `/tasks/${projectId}`,
    taskData
  );

  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

export const assignTask = async (taskId, memberId) => {
  const response = await api.patch(
    `/tasks/${taskId}/assign`,
    { memberId }
  );

  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    { status }
  );

  return response.data;
};

export const archiveTask = async (taskId) => {
  const response = await api.patch(
    `/tasks/${taskId}/archive`
  );

  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(
    `/tasks/${taskId}`
  );

  return response.data;
};

export const reorderTasks = async (projectId, tasks) => {
  const response = await api.patch(
    `/tasks/project/${projectId}/reorder`,
    {
      tasks,
    }
  );

  return response.data;
};
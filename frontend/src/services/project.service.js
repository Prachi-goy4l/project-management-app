import api from "../api/axios";

export const getProjects = async (organizationId) => {
  const response = await api.get(
    `/projects/organization/${organizationId}`
  );

  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.put(
    `/projects/${projectId}`,
    projectData
  );

  return response.data;
};

export const archiveProject = async (projectId) => {
  const response = await api.patch(
    `/projects/${projectId}/archive`
  );

  return response.data;
};

export const addProjectMember = async (
  projectId,
  memberId
) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    { memberId }
  );

  return response.data;
};

export const removeProjectMember = async (
  projectId,
  memberId
) => {
  const response = await api.delete(
    `/projects/${projectId}/members/${memberId}`
  );

  return response.data;
};
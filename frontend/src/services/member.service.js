import api from "../api/axios";

export const getOrganizationMembers = async (organizationId) => {
  const response = await api.get(
    `/members/${organizationId}`
  );

  return response.data;
};

export const getMembers = async (organizationId) => {
  const response = await api.get(
    `/members/${organizationId}`
  );

  return response.data;
};
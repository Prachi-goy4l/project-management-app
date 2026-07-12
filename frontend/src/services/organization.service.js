import api from "../api/axios";

export const createOrganization = async (organizationData) => {
  const response = await api.post("/organizations", organizationData);
  return response.data;
};

export const getOrganizations = async () => {
  const response = await api.get("/organizations");
  return response.data;
};

export const getOrganizationById = async (id) => {
  const response = await api.get(`/organizations/${id}`);
  return response.data;
};

export const updateOrganization = async (id, organizationData) => {
  const response = await api.put(`/organizations/${id}`, organizationData);
  return response.data;
};

export const deleteOrganization = async (id) => {
  const response = await api.delete(`/organizations/${id}`);
  return response.data;
};
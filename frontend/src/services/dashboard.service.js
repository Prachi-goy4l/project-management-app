import api from "../api/axios";

export const getOverview = async (organizationId) => {
  const response = await api.get(
    `/dashboard/overview/${organizationId}`
  );

  return response.data;
};
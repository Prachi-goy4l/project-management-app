import api from "../api/axios";

export const inviteMember = async (organizationId, inviteData) => {
  const response = await api.post(
    `/invites/${organizationId}/invite`,
    inviteData
  );

  return response.data;
};

export const getOrganizationInvites = async (organizationId) => {
  const response = await api.get(
    `/invites/${organizationId}`
  );

  return response.data;
};

export const deleteInvite = async (inviteId) => {
  const response = await api.delete(
    `/invites/${inviteId}`
  );

  return response.data;
};

export const acceptInvite = async (token) => {
  const response = await api.post(
    `/invites/accept/${token}`
  );

  return response.data;
};
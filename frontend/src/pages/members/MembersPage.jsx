import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InviteDialog from "@/components/members/InviteDialog";

import {
  getOrganizationInvites,
  deleteInvite,
} from "@/services/invite.service";

import { getOrganizationMembers } from "@/services/member.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { toast } from "sonner";

export default function MembersPage() {
  const { organizationId } = useParams();

  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, invitesData] = await Promise.all([
        getOrganizationMembers(organizationId),
        getOrganizationInvites(organizationId),
      ]);

      setMembers(membersData.data);
      setInvites(invitesData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inviteId) => {
    if (!window.confirm("Delete this invitation?")) return;

    try {
      await deleteInvite(inviteId);

      toast.success("Invitation deleted");

      loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete invitation");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Members
        </h1>

        <InviteDialog onSuccess={loadData} />
      </div>

      {/* Members */}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Organization Members
          </h2>

          {members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">
                      {member.userId?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {member.userId?.email}
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Pending Invitations
          </h2>

          {invites.length === 0 ? (
            <p>No pending invitations.</p>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite._id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">
                      {invite.email}
                    </p>

                    <p className="text-sm text-gray-500">
                      {invite.role}
                    </p>

                    <p className="text-xs text-gray-400">
                      {invite.status}
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleDelete(invite._id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
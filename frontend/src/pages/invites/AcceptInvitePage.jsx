import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { acceptInvite } from "@/services/invite.service";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);

      await acceptInvite(token);

      toast.success("Invitation accepted");

      navigate("/organizations");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Invalid invitation"
      );

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold">
              Organization Invitation
            </h1>

            <p className="text-muted-foreground mt-2">
              You have been invited to join an organization.
            </p>
          </div>

          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? "Joining..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
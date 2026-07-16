import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { acceptInvite } from "@/services/invite.service";

import { toast } from "sonner";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    accept();
  }, []);

  const accept = async () => {
    try {
      await acceptInvite(token);

      toast.success("Invitation accepted");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Invalid invitation"
      );

      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">
        Accepting invitation...
      </h1>
    </div>
  );
}
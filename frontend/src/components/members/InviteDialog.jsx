import { useState } from "react";
import { useParams } from "react-router-dom";

import { inviteMember } from "@/services/invite.service";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InviteDialog({ onSuccess }) {
  const { organizationId } = useParams();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await inviteMember(organizationId, {
        email,
        role,
      });

      toast.success("Invitation sent");

      setEmail("");
      setRole("Member");

      setOpen(false);

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send invite"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button />}
      >
        Invite Member
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite Member
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div>
            <Label>Role</Label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full border rounded-md p-2"
            >
              <option value="Member">
                Member
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
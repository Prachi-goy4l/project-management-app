import { useEffect, useState } from "react";
import {
  createOrganization,
  updateOrganization,
} from "@/services/organization.service";

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

const OrganizationDialog = ({
  mode = "create",
  organization = null,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && organization) {
      setName(organization.name);
      setIndustry(organization.industry);
    } else {
      setName("");
      setIndustry("");
    }
  }, [mode, organization]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");

    try {
      setLoading(true);

      if (mode === "create") {
        await createOrganization({
          name,
          industry,
        });

        toast.success("Organization created successfully");
      } else {
        await updateOrganization(organization._id, {
          name,
          industry,
        });

        toast.success("Organization updated successfully");
      }

      setOpen(false);

      setName("");
      setIndustry("");

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant={mode === "create" ? "default" : "outline"} />}
      >
        {mode === "create" ? "Create Organization" : "Edit"}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Organization" : "Edit Organization"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>

            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Industry</Label>

            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <Button
  type="submit"
  className="w-full"
  disabled={loading}
>
  {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationDialog;

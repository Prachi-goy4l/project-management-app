import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createProject, updateProject } from "@/services/project.service";

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

const ProjectDialog = ({ mode = "create", project = null, onSuccess }) => {
  const { organizationId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && project) {
      setName(project.name);
      setDescription(project.description || "");

      setStartDate(project.startDate ? project.startDate.substring(0, 10) : "");

      setEndDate(project.endDate ? project.endDate.substring(0, 10) : "");
    } else {
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    }
  }, [mode, project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");
    try {
      setLoading(true);

      if (mode === "create") {
        await createProject({
          name,
          description,
          organizationId,
          startDate,
          endDate,
        });

        toast.success("Project created");
      } else {
        await updateProject(project._id, {
          name,
          description,
          startDate,
          endDate,
        });

        toast.success("Project updated");
      }

      setOpen(false);

      onSuccess?.();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant={mode === "create" ? "default" : "outline"} />}
      >
        {mode === "create" ? "Create Project" : "Edit"}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>

            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>

            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Start Date</Label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>End Date</Label>

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;

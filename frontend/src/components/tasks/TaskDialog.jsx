import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import { createTask, updateTask } from "@/services/Task.service";

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
import { createTask, updateTask } from "@/services/task.service";

const TaskDialog = ({ mode = "create", task = null, onSuccess }) => {
  const { organizationId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && task) {
      setName(task.name);
      setDescription(task.description || "");

      setStartDate(task.startDate ? task.startDate.substring(0, 10) : "");

      setEndDate(task.endDate ? task.endDate.substring(0, 10) : "");
    } else {
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    }
  }, [mode, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED");
    try {
      setLoading(true);

      if (mode === "create") {
        await createTask({
          name,
          description,
          organizationId,
          startDate,
          endDate,
        });

        toast.success("Project created");
      } else {
        await updateTask(task._id, {
          name,
          description,
          startDate,
          endDate,
        });

        toast.success("Task updated");
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
        {mode === "create" ? "Create Task" : "Edit"}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Task" : "Edit Task"}
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

export default TaskDialog;

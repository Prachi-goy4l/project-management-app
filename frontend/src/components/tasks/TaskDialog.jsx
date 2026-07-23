import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTask, updateTask, assignTask } from "@/services/task.service";
import { getMembers } from "@/services/member.service";
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

const TaskDialog = ({ mode = "create", task = null, onSuccess }) => {
  const { projectId, organizationId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMembers = async () => {
      try {
        const data = await getMembers(organizationId);

        if (!cancelled) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadMembers();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  useEffect(() => {
    queueMicrotask(() => {
      if (mode === "edit" && task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority || "Medium");

        setDueDate(task.dueDate ? task.dueDate.substring(0, 10) : "");

        setAssignedTo(task.assignedTo?._id || "");
      } else {
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDueDate("");
        setAssignedTo("");
      }
    });
  }, [mode, task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response;

      if (mode === "create") {
        response = await createTask(projectId, {
          title,
          description,
          priority,
          dueDate,
        });

        if (assignedTo) {
          await assignTask(response.data._id, assignedTo);
        }

        toast.success("Task created");
      } else {
        await updateTask(task._id, {
          title,
          description,
          priority,
          dueDate,
        });

        if (assignedTo) {
          await assignTask(task._id, assignedTo);
        }

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
            <Label>Title</Label>

            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>

            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Priority</Label>

            <select
              className="w-full border rounded-md p-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <div>
            <Label>Due Date</Label>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Assign Member</Label>

            <select
              className="w-full border rounded-md p-2"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>

              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.userId?.name}
                </option>
              ))}
            </select>
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

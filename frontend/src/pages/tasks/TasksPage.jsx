import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "@/lib/socket";
import {
  getTasks,
  archiveTask,
  updateTaskStatus,
} from "@/services/task.service";

import TaskDialog from "@/components/tasks/TaskDialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export default function TasksPage() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Used for refreshes after create/edit/archive/status update
  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      const data = await getTasks(projectId);
      setTasks(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    }
  }, [projectId]);

  //for initial lode
  useEffect(() => {
    if (!projectId) return;

    let mounted = true;

    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId);

        if (mounted) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          toast.error("Failed to load tasks");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    const taskEvents = [
      "task-created",
      "task-updated",
      "task-status-updated",
      "task-assigned",
      "task-archived",
    ];

    socket.connect();
    socket.emit("join-project", projectId);

    taskEvents.forEach((event) => {
      socket.on(event, loadTasks);
    });

    return () => {
      mounted = false;

      taskEvents.forEach((event) => {
        socket.off(event, loadTasks);
      });

      socket.emit("leave-project", projectId);
      socket.disconnect();
    };
  }, [projectId, loadTasks]);

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this task?")) return;

    try {
      await archiveTask(id);

      toast.success("Task archived");

      loadTasks();
    } catch (error) {
      console.error(error);

      toast.error("Failed to archive task");
    }
  };

  const handleStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);

      loadTasks();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <TaskDialog projectId={projectId} onSuccess={loadTasks} />
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="font-bold text-xl">{task.title}</h2>

                  <p className="text-gray-500">{task.description}</p>
                </div>

                <div className="text-sm space-y-1">
                  <p>Status: {task.status}</p>

                  <p>Priority: {task.priority}</p>

                  <p>
                    Assigned: {task.assignedTo?.userId?.name || "Unassigned"}
                  </p>

                  <p>
                    Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <TaskDialog
                    mode="edit"
                    task={task}
                    projectId={projectId}
                    onSuccess={loadTasks}
                  />

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleStatus(
                        task._id,
                        task.status === "Todo"
                          ? "In Progress"
                          : task.status === "In Progress"
                          ? "Done"
                          : "Todo"
                      )
                    }
                  >
                    Change Status
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleArchive(task._id)}
                  >
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "@/lib/socket";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  getTasks,
  archiveTask,
  updateTaskStatus,
} from "@/services/task.service";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskDialog from "@/components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import StatusBadge from "@/components/tasks/StatusBadge";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import { Input } from "@/components/ui/input";
export default function TasksPage() {
  const { projectId, organizationId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions = ["All", "Todo", "In Progress", "Done"];

  const priorityOptions = ["All", "Low", "Medium", "High", "Urgent"];

  const [view, setView] = useState("table");

  const tableHeaders = [
    "Task",
    "Status",
    "Priority",
    "Assigned",
    "Due Date",
    "Actions",
  ];

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage all project tasks</p>
        </div>

        <TaskDialog
          projectId={projectId}
          organizationId={organizationId}
          onSuccess={loadTasks}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input
          placeholder="Search tasks..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Status" : status}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority === "All" ? "All Priority" : priority}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          onClick={() => setView("table")}
        >
          Table
        </Button>

        <Button
          variant={view === "kanban" ? "default" : "outline"}
          onClick={() => setView("kanban")}
        >
          Kanban
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : view === "table" ? (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{task.title}</p>

                      <p className="text-sm text-muted-foreground wrap-break-words whitespace-pre-wrap">
                        {task.description}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>

                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>

                  <TableCell>
                    {task.assignedTo?.userId?.name || "Unassigned"}
                  </TableCell>

                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell className="space-x-2">
                    <TaskDialog
                      mode="edit"
                      task={task}
                      projectId={projectId}
                      onSuccess={loadTasks}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatus(
                          task._id,
                          task.status === "Todo"
                            ? "In Progress"
                            : task.status === "In Progress"
                              ? "Done"
                              : "Todo",
                        )
                      }
                    >
                      Status
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleArchive(task._id)}
                    >
                      Archive
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          setTasks={setTasks}
          onStatusChange={updateTaskStatus}
        />
      )}
    </div>
  );
}

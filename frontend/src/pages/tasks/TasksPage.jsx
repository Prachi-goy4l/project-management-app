import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import socket from "@/lib/socket";

import {
  getTasks,
  archiveTask,
  updateTaskStatus,
  reorderTasks,
} from "@/services/task.service";

import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskDialog from "@/components/tasks/TaskDialog";
import StatusBadge from "@/components/tasks/StatusBadge";
import PriorityBadge from "@/components/tasks/PriorityBadge";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TasksPage() {
  const { projectId, organizationId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [view, setView] = useState("table");

  /*
   * Load tasks
   */
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

  /*
   * Initial load + realtime updates
   */
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

  /*
   * Archive
   */
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

  /*
   * Status
   */
  const handleStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);

      loadTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  /*
   * Filters
   */
  const filteredTasks = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchTerm ||
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm) ||
        task.taskCode?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const statusOptions = [
    "All",
    "Todo",
    "In Progress",
    "Done",
  ];

  const priorityOptions = [
    "All",
    "Low",
    "Medium",
    "High",
    "Urgent",
  ];

  const activeFilterCount =
    (statusFilter !== "All" ? 1 : 0) +
    (priorityFilter !== "All" ? 1 : 0);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
        </div>

        <div className="h-12 animate-pulse rounded-xl bg-slate-100" />

        <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() =>
                navigate(
                  `/organizations/${organizationId}/projects`,
                )
              }
              className="transition hover:text-slate-700"
            >
              Projects
            </button>

            <span>/</span>

            <span className="text-slate-500">
              Project
            </span>

            <span>/</span>

            <span className="font-medium text-slate-700">
              Tasks
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Tasks
            </h1>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {filteredTasks.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage project tasks, assignments, priorities, and progress.
          </p>
        </div>

        <TaskDialog
          projectId={projectId}
          organizationId={organizationId}
          onSuccess={loadTasks}
        />
      </div>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <Input
              placeholder="Search tasks, descriptions, or IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 border-slate-200 bg-slate-50 pl-10 shadow-none focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All"
                    ? "All statuses"
                    : status}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority === "All"
                    ? "All priorities"
                    : priority}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
                className="px-2 text-xs font-medium text-slate-400 transition hover:text-slate-700"
              >
                Clear
              </button>
            )}

            {/* Divider */}
            <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

            {/* View switcher */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setView("table")}
                className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition ${
                  view === "table"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <TableIcon />
                Table
              </button>

              <button
                type="button"
                onClick={() => setView("kanban")}
                className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition ${
                  view === "kanban"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <KanbanIcon />
                Kanban
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESULT SUMMARY
      ====================================================== */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>

        {search && (
          <p className="text-xs text-slate-400">
            Searching for{" "}
            <span className="font-medium text-slate-600">
              "{search}"
            </span>
          </p>
        )}
      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {filteredTasks.length === 0 ? (
        <EmptyTasksState
          hasFilters={
            Boolean(search) ||
            statusFilter !== "All" ||
            priorityFilter !== "All"
          }
          onClear={() => {
            setSearch("");
            setStatusFilter("All");
            setPriorityFilter("All");
          }}
        />
      ) : view === "table" ? (
        <TaskTable
          tasks={filteredTasks}
          projectId={projectId}
          onStatusChange={handleStatus}
          onArchive={handleArchive}
          onSuccess={loadTasks}
        />
      ) : (
        <KanbanBoard
          projectId={projectId}
          tasks={filteredTasks}
          setTasks={setTasks}
          onStatusChange={updateTaskStatus}
          onReorder={(currentProjectId, items) =>
            reorderTasks(currentProjectId, items)
          }
        />
      )}
    </div>
  );
}

/* ============================================================
   TASK TABLE
============================================================ */

function TaskTable({
  tasks,
  projectId,
  onStatusChange,
  onArchive,
  onSuccess,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="h-11 w-[110px] px-5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                ID
              </TableHead>

              <TableHead className="h-11 min-w-[320px] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Task
              </TableHead>

              <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </TableHead>

              <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Priority
              </TableHead>

              <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Assigned
              </TableHead>

              <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Due
              </TableHead>

              <TableHead className="h-11 w-[100px] text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                projectId={projectId}
                onStatusChange={onStatusChange}
                onArchive={onArchive}
                onSuccess={onSuccess}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ============================================================
   TASK ROW
============================================================ */

function TaskRow({
  task,
  projectId,
  onStatusChange,
  onArchive,
  onSuccess,
}) {
  const assignedUser = task.assignedTo?.userId;

  const initials = getInitials(assignedUser?.name);

  const nextStatus =
    task.status === "Todo"
      ? "In Progress"
      : task.status === "In Progress"
        ? "Done"
        : "Todo";

  return (
    <TableRow className="group border-b border-slate-100 transition hover:bg-slate-50/70">
      {/* Task ID */}
      <TableCell className="px-5">
        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] font-semibold text-slate-500">
          {task.taskCode}
        </span>
      </TableCell>

      {/* Task */}
      <TableCell>
        <div className="py-1">
          <p className="font-semibold leading-5 text-slate-900">
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 max-w-[460px] truncate text-xs leading-5 text-slate-400">
              {task.description}
            </p>
          )}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={task.status} />
      </TableCell>

      {/* Priority */}
      <TableCell>
        <PriorityBadge priority={task.priority} />
      </TableCell>

      {/* Assignee */}
      <TableCell>
        {assignedUser ? (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-600">
              {initials}
            </div>

            <span className="max-w-[130px] truncate text-xs font-medium text-slate-600">
              {assignedUser.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">
            Unassigned
          </span>
        )}
      </TableCell>

      {/* Due */}
      <TableCell>
        <DueDate date={task.dueDate} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-end gap-1 opacity-70 transition group-hover:opacity-100">
          <TooltipButton
            label="Edit task"
            onClick={() => {}}
          >
            <TaskDialog
              mode="edit"
              task={task}
              projectId={projectId}
              onSuccess={onSuccess}
            />
          </TooltipButton>

          <TooltipButton
            label={`Move to ${nextStatus}`}
            onClick={() =>
              onStatusChange(task._id, nextStatus)
            }
          >
            <RefreshIcon />
          </TooltipButton>

          <TooltipButton
            label="Archive task"
            danger
            onClick={() => onArchive(task._id)}
          >
            <ArchiveIcon />
          </TooltipButton>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyTasksState({ hasFilters, onClear }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <TaskIcon />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {hasFilters ? "No matching tasks" : "No tasks yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find what you're looking for."
          : "Create your first task to start tracking project work."}
      </p>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={onClear}
          className="mt-5"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}

/* ============================================================
   DUE DATE
============================================================ */

function DueDate({ date }) {
  if (!date) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const dueDate = new Date(date);
  const now = new Date();

  const isOverdue =
    dueDate < now &&
    dueDate.toDateString() !== now.toDateString();

  return (
    <span
      className={`text-xs font-medium ${
        isOverdue
          ? "text-red-600"
          : "text-slate-500"
      }`}
    >
      {dueDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </span>
  );
}

/* ============================================================
   TOOLTIP BUTTON
============================================================ */

function TooltipButton({
  label,
  children,
  onClick,
  danger = false,
}) {
  return (
    <div className="group/tooltip relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          danger
            ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        }`}
      >
        {children}
      </button>

      <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover/tooltip:block">
        {label}
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function getInitials(name = "") {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/* ============================================================
   ICONS
============================================================ */

function TableIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M9 4v16" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="11" rx="1" />
      <rect x="17" y="4" width="4" height="7" rx="1" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M5 6l1 14h12l1-14" />
      <path d="M9 10h6" />
      <path d="M9 6l1-3h4l1 3" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}
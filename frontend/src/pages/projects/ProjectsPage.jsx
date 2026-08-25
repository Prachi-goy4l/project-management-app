import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProjectDialog from "@/components/projects/ProjectDialog";

import {
  getProjects,
  archiveProject,
} from "@/services/project.service";

import { Button, Input } from "@/components/ui";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects(organizationId);
      setProjects(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    queueMicrotask(loadProjects);
  }, [loadProjects]);

  const handleArchive = async (projectId) => {
    setOpenMenu(null);

    if (!window.confirm("Archive this project?")) return;

    try {
      await archiveProject(projectId);

      toast.success("Project archived");

      loadProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive project");
    }
  };

  const getProjectColor = (index) => {
    const colors = [
      "border-t-blue-500",
      "border-t-violet-500",
      "border-t-emerald-500",
      "border-t-amber-500",
      "border-t-rose-500",
      "border-t-cyan-500",
    ];

    return colors[index % colors.length];
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";

      case "in progress":
        return "bg-blue-50 text-blue-700 ring-blue-100";

      case "planning":
        return "bg-violet-50 text-violet-700 ring-violet-100";

      case "archived":
        return "bg-slate-100 text-slate-500 ring-slate-200";

      default:
        return "bg-amber-50 text-amber-700 ring-amber-100";
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        project.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  /*
   * Your current project API does not appear to expose a progress
   * percentage or task count directly.
   *
   * These helpers safely use the fields if/when your API provides them.
   */
  const getProgress = (project) => {
    if (typeof project.progress === "number") {
      return Math.min(100, Math.max(0, project.progress));
    }

    if (
      project.totalTasks > 0 &&
      typeof project.completedTasks === "number"
    ) {
      return Math.round(
        (project.completedTasks / project.totalTasks) * 100,
      );
    }

    return 0;
  };

  const getTaskCount = (project) => {
    if (typeof project.totalTasks === "number") {
      return project.totalTasks;
    }

    if (Array.isArray(project.tasks)) {
      return project.tasks.length;
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>

        <div className="flex gap-3">
          <div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-600">
            Workspace
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Projects
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Organize your team&apos;s work and keep projects moving forward.
          </p>
        </div>

        <Button
          onClick={() => setOpenCreate(true)}
          className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-2"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>

          New project
        </Button>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-md">
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="h-10 rounded-lg border-slate-200 bg-white pl-10 shadow-none focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="All">All statuses</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* =====================================================
          PROJECT COUNT
      ====================================================== */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </p>

        {(search || statusFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* =====================================================
          CREATE / EDIT DIALOGS
      ====================================================== */}
      <ProjectDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        mode="create"
        onSuccess={() => {
          loadProjects();
          setOpenCreate(false);
        }}
      />

      <ProjectDialog
        open={!!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null);
          }
        }}
        mode="edit"
        project={editingProject}
        onSuccess={() => {
          loadProjects();
          setEditingProject(null);
        }}
      />

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h10" />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            {search || statusFilter !== "All"
              ? "No matching projects"
              : "No projects yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {search || statusFilter !== "All"
              ? "Try changing your search or status filter."
              : "Create your first project to start organizing your team's work."}
          </p>

          {!search && statusFilter === "All" && (
            <Button
              onClick={() => setOpenCreate(true)}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700"
            >
              Create project
            </Button>
          )}
        </div>
      ) : (
        /* =====================================================
           PROJECT GRID
        ====================================================== */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const progress = getProgress(project);
            const taskCount = getTaskCount(project);

            return (
              <div
                key={project._id}
                className={`group relative overflow-visible rounded-2xl border border-slate-200/80 border-t-4 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${getProjectColor(
                  index,
                )}`}
              >
                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                        {project.name}
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        aria-label={`Actions for ${project.name}`}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === project._id
                              ? null
                              : project._id,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="5" cy="12" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="19" cy="12" r="1.5" />
                        </svg>
                      </button>

                      {openMenu === project._id && (
                        <div className="absolute right-0 top-10 z-40 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);

                              navigate(
                                `/organizations/${organizationId}/projects/${project._id}/analytics`,
                              );
                            }}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                          >
                            Analytics
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenu(null);
                              setEditingProject(project);
                            }}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                          >
                            Edit project
                          </button>

                          {project.status !== "Archived" ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleArchive(project._id)
                              }
                              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Archive project
                            </button>
                          ) : (
                            <span className="flex w-full px-3 py-2 text-xs font-medium text-slate-400">
                              Archived
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusStyle(
                        project.status,
                      )}`}
                    >
                      {project.status || "Planning"}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Progress
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom metadata */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    {/* Members */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {(project.members || [])
                          .slice(0, 4)
                          .map((member, memberIndex) => (
                            <div
                              key={
                                member._id ||
                                member.id ||
                                memberIndex
                              }
                              title={member.name}
                              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-semibold text-slate-600"
                            >
                              {getInitials(member.name)}
                            </div>
                          ))}

                        {project.members?.length > 4 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-semibold text-slate-500">
                            +{project.members.length - 4}
                          </div>
                        )}

                        {(!project.members ||
                          project.members.length === 0) && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400">
                            —
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>

                      <span>
                        {taskCount}{" "}
                        {taskCount === 1 ? "task" : "tasks"}
                      </span>
                    </div>
                  </div>

                  {/* Main action */}
                  <Button
                    onClick={() =>
                      navigate(
                        `/organizations/${organizationId}/projects/${project._id}/tasks`,
                      )
                    }
                    className="mt-5 h-10 w-full rounded-lg bg-slate-900 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    View tasks

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="ml-1.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
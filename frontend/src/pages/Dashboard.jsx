import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOverview } from "@/services/dashboard.service";

export default function Dashboard() {
  const { organizationId } = useParams();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(!organizationId);

  useEffect(() => {
    let cancelled = false;

    if (!organizationId) {
      return;
    }

    const loadDashboard = async () => {
      try {
        const data = await getOverview(organizationId);

        if (!cancelled) {
          setStats(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100 lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Projects",
      value: stats?.projects ?? 0,
      trend: "+12% this month",
      icon: "projects",
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tasks",
      value: stats?.totalTasks ?? 0,
      trend: "+8% this month",
      icon: "tasks",
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Completed",
      value: stats?.completedTasks ?? 0,
      trend: "+18% this month",
      icon: "completed",
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending",
      value: stats?.pendingTasks ?? 0,
      trend: "-6% this month",
      icon: "pending",
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  // Replace these with API data when available.
  const recentProjects = [
    {
      name: "Website Redesign",
      description: "Marketing website and landing pages",
      progress: 72,
      status: "In progress",
      statusClass: "bg-blue-50 text-blue-700",
    },
    {
      name: "Mobile Application",
      description: "Customer mobile experience",
      progress: 48,
      status: "In progress",
      statusClass: "bg-indigo-50 text-indigo-700",
    },
    {
      name: "Design System",
      description: "Reusable UI components",
      progress: 91,
      status: "Almost done",
      statusClass: "bg-emerald-50 text-emerald-700",
    },
    {
      name: "Product Launch",
      description: "Launch planning and preparation",
      progress: 34,
      status: "Planning",
      statusClass: "bg-amber-50 text-amber-700",
    },
  ];

  const activities = [
    {
      initials: "SJ",
      name: "Sarah Johnson",
      action: "completed a task",
      target: "Update landing page",
      time: "12 min ago",
    },
    {
      initials: "MK",
      name: "Michael Kim",
      action: "created a project",
      target: "Mobile Application",
      time: "1 hour ago",
    },
    {
      initials: "AR",
      name: "Alex Rivera",
      action: "moved a task to",
      target: "In Progress",
      time: "3 hours ago",
    },
    {
      initials: "JD",
      name: "John Doe",
      action: "commented on",
      target: "Design System",
      time: "5 hours ago",
    },
  ];

  const totalTasks = stats?.totalTasks ?? 0;
  const completedTasks = stats?.completedTasks ?? 0;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const getIcon = (type) => {
    if (type === "projects") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    }

    if (type === "tasks") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    }

    if (type === "completed") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    }

    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* =====================================================
          1. WELCOME HEADER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-600">
            Tuesday, August 25, 2026
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your organization today.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Organization
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            Your Organization
          </p>
        </div>
      </div>

      {/* =====================================================
          2. STAT CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
              >
                {getIcon(item.icon)}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5">
              <span
                className={
                  item.title === "Pending"
                    ? "text-xs font-semibold text-emerald-600"
                    : "text-xs font-semibold text-emerald-600"
                }
              >
                {item.trend.split(" ")[0]}
              </span>

              <span className="text-xs text-slate-400">
                this month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          3 + 4. PROJECTS / TASK PROGRESS
      ====================================================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent projects
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Keep an eye on your active work.
              </p>
            </div>

            <button className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700">
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="px-6 py-5 transition hover:bg-slate-50/60"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate text-sm font-semibold text-slate-800">
                        {project.name}
                      </h3>

                      <span
                        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex ${project.statusClass}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {project.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-slate-600">
                    {project.progress}%
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Progress */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Task progress
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Overall completion across your workspace.
            </p>
          </div>

          {/* Circular-ish progress visual */}
          <div className="my-8 flex justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#10b981 ${completionPercentage}%, #ecfdf5 ${completionPercentage}% 100%)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-semibold tracking-tight text-slate-900">
                  {completionPercentage}%
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  completed
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-slate-600">
                  Completed
                </span>
              </div>

              <span className="text-sm font-semibold text-emerald-700">
                {completedTasks}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />

                <span className="text-xs font-medium text-slate-600">
                  Pending
                </span>
              </div>

              <span className="text-sm font-semibold text-amber-700">
                {stats?.pendingTasks ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          5. RECENT ACTIVITY
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Recent activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest updates from your team.
            </p>
          </div>

          <button className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700">
            View activity
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div
              key={`${activity.name}-${activity.time}`}
              className="flex items-center gap-4 px-6 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                {activity.initials}
              </div>

              <div className="min-w-0 flex-1 text-sm">
                <span className="font-medium text-slate-800">
                  {activity.name}
                </span>{" "}
                <span className="text-slate-500">
                  {activity.action}
                </span>{" "}
                <span className="font-medium text-slate-700">
                  {activity.target}
                </span>
              </div>

              <span className="shrink-0 text-xs text-slate-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
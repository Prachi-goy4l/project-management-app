import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProjectAnalytics } from "@/services/project.service";

import StatCard from "@/components/analytics/StatCard";
import StatusChart from "@/components/analytics/StatusChart";
import PriorityChart from "@/components/analytics/PriorityChart";
import WorkloadChart from "@/components/analytics/WorkloadChart";

export default function ProjectAnalytics() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const data = await getProjectAnalytics(projectId);

        if (!cancelled) {
          setAnalytics(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const summary = analytics?.summary;

  const completionPercentage = useMemo(() => {
    if (!summary?.totalTasks) return 0;

    return Math.round(
      (summary.completedTasks / summary.totalTasks) * 100,
    );
  }, [summary]);

  const teamSize =
    summary?.teamSize ??
    analytics?.memberWorkload?.length ??
    0;

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-900" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Analytics unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't load analytics for this project.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* =====================================================
          DARK PROJECT HEADER
      ====================================================== */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-sm md:px-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center text-xs font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to project
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Project analytics
              </p>

              <h1 className="text-3xl font-semibold tracking-tight">
                Project Overview
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Monitor progress, task distribution, priorities, and
                team workload from one place.
              </p>
            </div>

            {/* Completion indicator */}
            <div className="min-w-[220px]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Overall completion
                </span>

                <span className="text-sm font-semibold text-emerald-400">
                  {completionPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUMMARY STRIP
      ====================================================== */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completion"
          value={`${completionPercentage}%`}
          color="text-emerald-600"
        />

        <StatCard
          title="Total Tasks"
          value={summary?.totalTasks ?? 0}
          color="text-slate-700"
        />

        <StatCard
          title="Overdue"
          value={summary?.overdueTasks ?? 0}
          color="text-red-600"
        />

        <StatCard
          title="Team Size"
          value={teamSize}
          color="text-blue-600"
        />
      </section>

      {/* =====================================================
          SECONDARY TASK STATS
      ====================================================== */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="To Do"
          value={summary?.todoTasks ?? 0}
          color="text-slate-500"
        />

        <StatCard
          title="In Progress"
          value={summary?.inProgressTasks ?? 0}
          color="text-blue-600"
        />

        <StatCard
          title="Completed"
          value={summary?.completedTasks ?? 0}
          color="text-emerald-600"
        />
      </section>

      {/* =====================================================
          CHART GRID
      ====================================================== */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Task status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              How tasks are distributed across their current states.
            </p>
          </div>

          <StatusChart data={analytics.status} />

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

            <p className="text-xs leading-5 text-slate-500">
              {getStatusInsight(summary)}
            </p>
          </div>
        </div>

        {/* Priority */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Task priority
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Understand where the team's highest-priority work is
              concentrated.
            </p>
          </div>

          <PriorityChart data={analytics.priority} />

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-orange-50 p-4">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />

            <p className="text-xs leading-5 text-orange-800/70">
              {getPriorityInsight(analytics.priority)}
            </p>
          </div>
        </div>

        {/* Workload */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Team workload
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Compare task assignments across team members.
            </p>
          </div>

          <WorkloadChart data={analytics.memberWorkload} />

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />

            <p className="text-xs leading-5 text-blue-900/70">
              {getWorkloadInsight(analytics.memberWorkload)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   INSIGHTS
============================================================ */

function getStatusInsight(summary) {
  if (!summary) {
    return "No status information is available yet.";
  }

  const total = summary.totalTasks || 0;

  if (!total) {
    return "No tasks have been added to this project yet.";
  }

  const completed = summary.completedTasks || 0;
  const inProgress = summary.inProgressTasks || 0;
  const todo = summary.todoTasks || 0;

  if (inProgress >= completed && inProgress >= todo) {
    return "Most work is currently in progress.";
  }

  if (completed >= inProgress && completed >= todo) {
    return "Most project work has already been completed.";
  }

  return "Most tasks are still waiting to be started.";
}

function getPriorityInsight(priority = []) {
  if (!priority.length) {
    return "No priority information is available yet.";
  }

  const highest = [...priority].sort(
    (a, b) => (b.value || b.count || 0) - (a.value || a.count || 0),
  )[0];

  if (!highest) {
    return "Priority distribution is currently unavailable.";
  }

  const name =
    highest.name ||
    highest.priority ||
    highest.label ||
    "one priority";

  return `Most tasks currently fall under ${name}. Keep an eye on high-priority work to prevent bottlenecks.`;
}

function getWorkloadInsight(workload = []) {
  if (!workload.length) {
    return "No team workload information is available yet.";
  }

  const sorted = [...workload].sort(
    (a, b) => (b.value || b.tasks || b.count || 0) -
      (a.value || a.tasks || a.count || 0),
  );

  const highest = sorted[0];

  const name =
    highest?.name ||
    highest?.memberName ||
    highest?.label ||
    "A team member";

  return `${name} currently has the largest task workload. Consider balancing assignments if their workload continues to grow.`;
}
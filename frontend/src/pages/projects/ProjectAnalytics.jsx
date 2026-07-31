import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectAnalytics } from "@/services/project.service";
import StatCard from "@/components/analytics/StatCard";
import StatusChart from "@/components/analytics/StatusChart";
import PriorityChart from "@/components/analytics/PriorityChart";
import WorkloadChart from "@/components/analytics/WorkloadChart";

export default function ProjectAnalytics() {
  const { projectId } = useParams();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getProjectAnalytics(projectId);
        setAnalytics(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAnalytics();
  }, [projectId]);

  if (!analytics) {
    return <p>Loading analytics...</p>;
  }

  return (
  <div className="space-y-8 p-6">
    <div>
      <h1 className="text-3xl font-bold">
        Project Analytics
      </h1>

      <p className="text-muted-foreground">
        Overview of project progress and workload
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={analytics.summary.totalTasks}
        color="text-blue-600"
      />

      <StatCard
        title="Completed"
        value={analytics.summary.completedTasks}
        color="text-green-600"
      />

      <StatCard
        title="In Progress"
        value={analytics.summary.inProgressTasks}
        color="text-yellow-500"
      />

      <StatCard
        title="Overdue"
        value={analytics.summary.overdueTasks}
        color="text-red-600"
      />
      <div className="grid lg:grid-cols-2 gap-6">
  <StatusChart data={analytics.status} />

  <PriorityChart
    data={analytics.priority}
  />
</div>
<div className="mt-6">
  <WorkloadChart
    data={analytics.memberWorkload}
  />
</div>
    </div>
  </div>
);
}
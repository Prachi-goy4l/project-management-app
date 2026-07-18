import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StatsCard from "@/components/dashboard/StatsCard";
import { getOverview } from "@/services/dashboard.service";

export default function Dashboard() {
  const { organizationId } = useParams();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (organizationId) {
    loadDashboard();
  }
}, [organizationId]);

  const loadDashboard = async () => {
    try {
      const data = await getOverview(organizationId);

      setStats(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome to your Project Management Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projects"
          value={stats.projects}
        />

        <StatsCard
          title="Tasks"
          value={stats.totalTasks}
        />

        <StatsCard
          title="Completed"
          value={stats.completedTasks}
        />

        <StatsCard
          title="Pending"
          value={stats.pendingTasks}
        />
      </div>
    </div>
  );
}
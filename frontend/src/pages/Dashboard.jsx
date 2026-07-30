import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StatsCard from "@/components/dashboard/StatsCard";
import { getOverview } from "@/services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const statsCards = [
  {
    title: "Projects",
    value: stats?.projects ?? 0,
  },
  {
    title: "Tasks",
    value: stats?.totalTasks ?? 0,
  },
  {
    title: "Completed",
    value: stats?.completedTasks ?? 0,
  },
  {
    title: "Pending",
    value: stats?.pendingTasks ?? 0,
  },
];
  const { organizationId } = useParams();

  const [loading, setLoading] = useState(true);

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
    return <h1>Loading...</h1>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-500 mt-1">
          Welcome to your Project Management Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((item) => (
          <StatsCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>
    </div>
  );
}
//usecallback hook - done
//map in statscard - done
//project create button refactor - done
//taskpage socket and useeffect - done
//acceptinvite
//rechart package (react chart oackages)

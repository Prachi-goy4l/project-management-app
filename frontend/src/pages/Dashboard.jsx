import StatsCard from "@/components/dashboard/StatsCard";

const stats = [
  {
    title: "Projects",
    value: 12,
  },
  {
    title: "Tasks",
    value: 48,
  },
  {
    title: "Members",
    value: 7,
  },
  {
    title: "Pending",
    value: 9,
  },
];

const Dashboard = () => {
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
        {stats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
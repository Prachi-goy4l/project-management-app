import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui";

export default function WorkloadChart({ data }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Member Workload
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 10,
                right: 20,
                left: 30,
                bottom: 10,
              }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
              />

              <YAxis
                dataKey="member"
                type="category"
                width={100}
              />

              <Tooltip />

              <Bar
                dataKey="tasks"
                radius={[0, 6, 6, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
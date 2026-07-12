import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm text-gray-500">
          {title}
        </h3>

        <h1 className="text-3xl font-bold mt-2">
          {value}
        </h1>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
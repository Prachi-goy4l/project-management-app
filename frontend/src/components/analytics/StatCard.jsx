import { Card, CardContent } from "@/components/ui";

export default function StatCard({
  title,
  value,
  color = "text-blue-600",
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}
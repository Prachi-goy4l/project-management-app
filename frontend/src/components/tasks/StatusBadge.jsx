import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const variants = {
    Todo: "secondary",
    "In Progress": "default",
    Done: "success",
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {status}
    </Badge>
  );
}
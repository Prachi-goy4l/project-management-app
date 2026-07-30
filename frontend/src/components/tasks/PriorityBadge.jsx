import { Badge } from "@/components/ui/badge";

export default function PriorityBadge({ priority }) {
  const colors = {
    Low: "secondary",
    Medium: "outline",
    High: "destructive",
    Urgent: "default",
  };

  return (
    <Badge variant={colors[priority]}>
      {priority}
    </Badge>
  );
}
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PriorityBadge from "./PriorityBadge";

export default function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border p-4 shadow-sm hover:shadow transition cursor-grab active:cursor-grabbing"
    >
      <h3 className="font-semibold">
        {task.title}
      </h3>

      <p className="text-sm text-muted-foreground mt-2">
        {task.description}
      </p>

      <div className="mt-4 flex justify-between">
        <PriorityBadge priority={task.priority} />

        <span className="text-xs text-muted-foreground">
          {task.assignedTo?.userId?.name || "Unassigned"}
        </span>
      </div>
    </div>
  );
}
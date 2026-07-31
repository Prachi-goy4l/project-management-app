import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PriorityBadge from "./PriorityBadge";

export default function TaskCard({ task, isOverlay = false }) {
  const sortable = useSortable({
    id: task._id,
    disabled: isOverlay,
  });
   
  const { attributes, listeners, setNodeRef, transform, transition } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className="bg-white rounded-lg border p-4 shadow-sm hover:shadow transition cursor-grab active:cursor-grabbing"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {task.taskCode || "TASK-000"}
      </p>

      <h3 className="font-semibold mt-1">{task.title}</h3>

      <p className="text-sm text-muted-foreground mt-2">{task.description}</p>

      <div className="mt-4 flex justify-between items-center">
        <PriorityBadge priority={task.priority} />

        <span className="text-xs text-muted-foreground">
          {task.assignedTo?.userId?.name || "Unassigned"}
        </span>
      </div>
    </div>
  );
}

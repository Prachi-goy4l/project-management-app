import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";

export default function KanbanColumn({
  title,
  tasks,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 min-h-[500px] transition
      ${
        isOver
          ? "bg-blue-100 border-2 border-blue-500"
          : "bg-slate-100"
      }`}
    >
      <h2 className="font-bold text-lg mb-4">
        {title}
      </h2>

      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
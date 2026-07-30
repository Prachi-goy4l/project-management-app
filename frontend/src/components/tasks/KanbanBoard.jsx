import { DndContext, closestCorners } from "@dnd-kit/core";

import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({ tasks, setTasks, onStatusChange }) {
  const todo = tasks.filter((task) => task.status === "Todo");

  const progress = tasks.filter((task) => task.status === "In Progress");

  const done = tasks.filter((task) => task.status === "Done");

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;

    const taskId = active.id;

    const newStatus = over.id;

    const task = tasks.find((t) => t._id === taskId);

    if (!task) return;

    if (task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await onStatusChange(taskId, newStatus);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-6">
        <KanbanColumn title="Todo" tasks={todo} />

        <KanbanColumn title="In Progress" tasks={progress} />

        <KanbanColumn title="Done" tasks={done} />
      </div>
    </DndContext>
  );
}

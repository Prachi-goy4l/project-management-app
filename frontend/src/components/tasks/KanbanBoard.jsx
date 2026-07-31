import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

export default function KanbanBoard({
  projectId,
  tasks,
  setTasks,
  onStatusChange,
  onReorder,
}) {
  const [activeTask, setActiveTask] = useState(null);

  const statuses = ["Todo", "In Progress", "Done"];

  const handleDragStart = ({ active }) => {
    const task = tasks.find((t) => t._id === active.id);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t._id === activeId);

    if (!activeTask) return;

    const overTask = tasks.find((t) => t._id === overId);

    // ==========================
    // SAME COLUMN REORDER
    // ==========================
    if (overTask && overTask.status === activeTask.status) {
      const columnTasks = tasks
        .filter((t) => t.status === activeTask.status)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnTasks.findIndex(
        (t) => t._id === activeId
      );

      const newIndex = columnTasks.findIndex(
        (t) => t._id === overId
      );

      const reorderedColumn = arrayMove(
        columnTasks,
        oldIndex,
        newIndex
      ).map((task, index) => ({
        ...task,
        order: index,
      }));

      const updatedTasks = tasks.map((task) => {
        const updated = reorderedColumn.find(
          (t) => t._id === task._id
        );

        return updated || task;
      });

      setTasks(updatedTasks);

      await onReorder(
        projectId,
        reorderedColumn.map((task) => ({
          id: task._id,
          order: task.order,
        }))
      );

      return;
    }

    // ==========================
    // MOVE TO ANOTHER COLUMN
    // ==========================

    let newStatus = null;

    if (overTask) {
      newStatus = overTask.status;
    } else if (statuses.includes(overId)) {
      newStatus = overId;
    }

    if (!newStatus) return;

    const updatedTasks = tasks.map((task) =>
      task._id === activeId
        ? {
            ...task,
            status: newStatus,
          }
        : task
    );

    setTasks(updatedTasks);

    await onStatusChange(activeId, newStatus);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-6">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            title={status}
            tasks={tasks
              .filter((task) => task.status === status)
              .sort((a, b) => a.order - b.order)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
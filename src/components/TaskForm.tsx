import { useState } from "react";
import type { TaskData, TaskPayload } from "@/context/types.ts";
import TaskForm from "@/components/TaskForm";
import Modal from "@/components/Modal";

interface TaskActionsProps {
  task: TaskData;
  updateTask: (taskId: number, payload: TaskPayload) => Promise<TaskData | null>;
  deleteTask: (taskId: number) => Promise<string>;
}

export default function TaskActions({ task, updateTask, deleteTask }: TaskActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async (payload: TaskPayload) => {
    try {
      await updateTask(task.id, payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ backgroundColor: "blue", color: "white", padding: "0.25rem 0.75rem" }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white", padding: "0.25rem 0.75rem" }}
      >
        Delete
      </button>

      <Modal
        isOpen={isModalOpen}
        title="Edit Task"
        body={
          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsModalOpen(false)}
          />
        }
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

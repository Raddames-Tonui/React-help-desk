import React, { useState } from "react";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TOKEN } from "@/utils/Constants";
import type { TaskData } from "@/context/types";
import TaskForm from "./TaskForm";

interface TaskActionsProps {
  task: TaskData;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

  const openModal = (
    title: string,
    body: React.ReactNode,
    footer?: React.ReactNode
  ) => {
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer || null);
    setIsModalOpen(true);
  };

  const editMutation = useMutation({
    mutationFn: async (updatedTask: Partial<TaskData>) => {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleEdit = () => {
    openModal(
      "Edit Task",
      <TaskForm
        task={task}
        onSubmit={(values) => editMutation.mutate(values)}
        onClose={() => setIsModalOpen(false)}
      />
    );
  };

  const handleDelete = () => {
    openModal(
      "Delete Task",
      <div
        style={{
          color: "#f02929cc",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Icon iconName="dangerIcon" style={{ height: "70px", color: "#f02929cc" }} />
        <h3>Are you sure you want to delete this task?</h3>
      </div>,
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          className="modal-close-btn"
          style={{ backgroundColor: "#f02929cc" }}
          onClick={() => {
            deleteMutation.mutate(task.id);
            setIsModalOpen(false);
          }}
          disabled={deleteMutation.isPending}
        >
          Yes, Delete
        </button>
        <button className="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="action-icons">
      <button onClick={handleEdit}>
        <Icon iconName="editIcon" style={{ width: "18px" }} /> Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={deleteMutation.isPending || editMutation.isPending}
      >
        <Icon iconName="delete" style={{ width: "18px" }} /> Delete
      </button>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskActions;

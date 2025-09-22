import React, { useState } from "react";
import { Route } from "@/routes/_protected/admin/tasks";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import type { TaskData, TaskPayload } from "@/context/types";
import "@/css/index.css";

interface TaskActionsProps {
  task: TaskData;
  updateTask: (taskId: number, payload: TaskPayload) => Promise<TaskData | null>;
  deleteTask: (taskId: number) => Promise<string>;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task, updateTask, deleteTask }) => {
  const navigate = Route.useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

  const openModal = (title: string, body: React.ReactNode, footer?: React.ReactNode) => {
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer || null);
    setIsModalOpen(true);
  };

  // -------- Edit --------
  const handleEdit = () => {
    const updatedPayload: TaskPayload = {
      subject_id: task.subject_id,
      title: task.title,
      description: task.description,
      requirements: task.requirements,
      due_date: task.due_date,
      max_score: task.max_score,
    };

    openModal(
      "Edit Task",
      <div className="modal-form-group">
        <label>
          Title:
          <input
            type="text"
            defaultValue={task.title}
            onChange={(e) => (updatedPayload.title = e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            defaultValue={task.description}
            onChange={(e) => (updatedPayload.description = e.target.value)}
            rows={5}
          />
        </label>
        <label>
          Requirements:
          <textarea
            defaultValue={task.requirements}
            onChange={(e) => (updatedPayload.requirements = e.target.value)}
            rows={5}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            defaultValue={task.due_date.split("T")[0]}
            onChange={(e) => (updatedPayload.due_date = e.target.value)}
          />
        </label>
        <label>
          Max Score:
          <input
            type="number"
            defaultValue={task.max_score}
            onChange={(e) => (updatedPayload.max_score = Number(e.target.value))}
          />
        </label>
      </div>,
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          className="modal-close-btn"
          onClick={async () => {
            await updateTask(task.id, updatedPayload);
            setIsModalOpen(false);
          }}
        >
          Save
        </button>
        <button className="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </button>
      </div>
    );
  };

  // -------- Delete --------
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
          onClick={async () => {
            await deleteTask(task.id);
            setIsModalOpen(false);
          }}
        >
          Yes, Delete
        </button>
        <button className="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </button>
      </div>
    );
  };

  const handleView = () => {
    navigate({
      to: `/admin/tasks/$taskId`,
      params: { taskId: task.id.toString() },
    });
  };

  return (
    <div className="action-icons">
      <button onClick={handleEdit}>
        <Icon iconName="editIcon" style={{ width: "18px" }} />
        Edit
      </button>
      <button onClick={handleView}>
        <Icon iconName="eyeView" style={{ width: "18px" }} />
        View
      </button>
      <button onClick={handleDelete}>
        <Icon iconName="delete" style={{ width: "18px" }} />
        Delete
      </button>

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        body={modalBody}
        footer={modalFooter}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TaskActions;

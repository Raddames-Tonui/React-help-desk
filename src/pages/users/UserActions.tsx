import React, { useState } from "react";
import { Route } from "@/routes/_protected/admin/users";
import Modal from "@/components/Modal";
import Icon from "@/utils/Icon";
import { TOKEN } from "@/context/hooks";
import { toast } from "react-hot-toast";
import type { UserData } from "@/context/types";
import "@/css/index.css";
import { useMutation } from "@tanstack/react-query";

interface UserActionsProps {
  user: UserData;
  onRefresh: () => void;
}

async function mutateRequest<T>(
  url: string,
  method: "PUT" | "DELETE",
  body?: T
): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("Request failed");
}

const UserActions: React.FC<UserActionsProps> = ({ user, onRefresh }) => {
  const navigate = Route.useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

  const editRoleMutation = useMutation({
    mutationFn: (data: { role: string }) =>
      mutateRequest(`/api/admin/users/${user.id}/role`, "PUT", data),
    onSuccess: () => {
      toast.success("Role updated successfully!");
      setIsModalOpen(false);
      onRefresh();
    },
    onError: () => toast.error("Failed to update role"),
  });

  const editStatusMutation = useMutation({
    mutationFn: (data: { status: string }) =>
      mutateRequest(`/api/admin/users/${user.id}/status`, "PUT", data),
    onSuccess: () => {
      toast.success("Status updated successfully!");
      setIsModalOpen(false);
      onRefresh();
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: () =>
      mutateRequest(`/api/admin/users/${user.id}`, "DELETE"),
    onSuccess: () => {
      toast.success("User deleted successfully!");
      setIsModalOpen(false);
      onRefresh();
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const openModal = (title: string, body: React.ReactNode, footer?: React.ReactNode) => {
    setModalTitle(title);
    setModalBody(body);
    setModalFooter(footer || null);
    setIsModalOpen(true);
  };

  const handleEditRole = () => {
    openModal(
      "Edit Role",
      <div>
        <h3>Edit User's Role</h3>
        <select
          value={user.role}
          onChange={(e) => editRoleMutation.mutate({ role: e.target.value })}
          className="button-sec"
        >
          <option value="admin">Admin</option>
          <option value="trainee">Trainee</option>
        </select>
      </div>
    );
  };

  const handleEditStatus = () => {
    openModal(
      "Edit Status",
      <div>
        <h3>Edit User's Status</h3>
        <select
          value={user.status}
          onChange={(e) => editStatusMutation.mutate({ status: e.target.value })}
          className="button-sec"
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    );
  };

  const handleDelete = () => {
    openModal(
      "Delete User",
      <div
        style={{
          color: "#f02929cc",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Icon iconName="dangerIcon" style={{ height: "70px", color: "#f02929cc" }} />
        <h3>Are you sure you want to delete this user?</h3>
      </div>,
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          className="modal-close-btn"
          style={{ backgroundColor: "#f02929cc" }}
          onClick={() => deleteUserMutation.mutate()}
        >
          Yes, Delete
        </button>
        <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
      </div>
    );
  };

  const handleView = () => {
    navigate({ to: `/admin/users/$userId`, params: { userId: user.id.toString() } });
  };

  return (
    <div className="action-icons">
      <button onClick={handleEditRole}>
        <Icon iconName="editIcon" style={{ width: "18px" }} />Role
      </button>
      <button onClick={handleEditStatus}>
        <Icon iconName="editIcon" style={{ width: "18px" }} />Status
      </button>
      <button onClick={handleView}>
        <Icon iconName="eyeView" style={{ width: "18px" }} />View
      </button>
      <button onClick={handleDelete}>
        <Icon iconName="delete" style={{ width: "18px" }} />Delete
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

export default UserActions;

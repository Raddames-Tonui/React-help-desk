import React from "react";
import type { UserData } from "@/context/types.ts";

interface ActionsCellProps {
  user: UserData;
  viewProfile: (id: number) => Promise<{ name: string; email: string } | null>;
  editStatus: (id: number, status: string) => Promise<void>;
  editRole: (id: number, role: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  openModal: (content: React.ReactNode) => void;
  navigate: (opts: { to: string }) => void; 
}

export const ActionsCell: React.FC<ActionsCellProps> = ({
  user,
  viewProfile,
  editStatus,
  editRole,
  deleteUser,
  openModal,
  navigate,
}) => {
  const handleView = async () => {
    const profile = await viewProfile(user.id);
    if (profile)
      openModal(
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
        </div>
      );
  };

  const handleEditStatus = () => {
    openModal(
      <div className="flex flex-col gap-2">
        <label>
          Status:
          <select
            defaultValue={user.status}
            className="table-select"
            onChange={async (e) => {
              const newStatus = e.target.value;
              await editStatus(user.id, newStatus);
              openModal(<p>Status updated to {newStatus}!</p>);
            }}
          >
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>
    );
  };

  const handleEditRole = () => {
    openModal(
      <div className="flex flex-col gap-2">
        <label>
          Role:
          <select
            defaultValue={user.role}
            className="table-select"
            onChange={async (e) => {
              const newRole = e.target.value;
              await editRole(user.id, newRole);
              openModal(<p>Role updated to {newRole}!</p>);
            }}
          >
            <option value="admin">Admin</option>
            <option value="trainee">Trainee</option>
          </select>
        </label>
      </div>
    );
  };

  const handleDelete = () => {
    openModal(
      <div className="flex flex-col gap-4">
        <p>Are you sure you want to delete {user.name}?</p>
        <div className="flex gap-2">
          <button
            className="btn-delete"
            onClick={async () => {
              await deleteUser(user.id);
              openModal(<p>User {user.name} deleted successfully!</p>);
            }}
          >
            OK
          </button>
          <button className="btn-close" onClick={() => openModal(null)}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-2">
      <button className="btn-view" onClick={handleView}>
        View
      </button>
      <button className="btn-edit" onClick={handleEditStatus}>
        Edit Status
      </button>
      <button className="btn-edit" onClick={handleEditRole}>
        Edit Role
      </button>
      <button className="btn-delete" onClick={handleDelete}>
        Delete
      </button>
      <button
        className="btn-nav"
        onClick={() => navigate({ to: `/admin/users/${user.id}` })}
      >
        Open Page
      </button>
    </div>
  );
};

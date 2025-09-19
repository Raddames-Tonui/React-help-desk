// src/pages/UsersPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useUsers } from "@/context/usersContext";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import { Route } from "@/routes/_protected/admin/users";
import { sortData } from "@/components/table/utils/tableUtils";
import type { UserData } from "@/utils/types";
import Modal from "@/components/Modal";

export default function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    users,
    data,
    loading,
    error,
    page,
    pageSize,
    params,
    setPage,
    setPageSize,
    setParams,
    refresh,
    viewProfile,
    editStatus,
    editRole,
    deleteUser,
  } = useUsers();

  const initialSortFromUrl: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy.split(",").map((s) => {
      const [column, direction = "asc"] = s.trim().split(" ");
      return { column, direction: direction as "asc" | "desc" };
    })
    : [{ column: "id", direction: "asc" }];

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // ----- Modal state -----
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    setPage(Number(searchParams.page) || 1);
    setPageSize(Number(searchParams.pageSize) || 10);

    const backendParams: Record<string, string> = {};
    if (searchParams.role) backendParams.role = String(searchParams.role);
    if (searchParams.status) backendParams.status = String(searchParams.status);

    setParams(backendParams);
  }, [searchParams, setPage, setPageSize, setParams]);

  const sortedUsers = useMemo(() => sortData(users, sortBy), [users, sortBy]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data || users.length === 0) return <p>No data available.</p>;

  // ----- Actions Cell -----
  const ActionsCell = ({ user }: { user: UserData }) => (
    <div className="flex gap-2">
      <button
        onClick={async (e) => {
          e.stopPropagation();
          const profile = await viewProfile(user.id);
          if (profile) {
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
          }
        }}
        className="btn-view"
      >
        View
      </button>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          await editStatus(
            user.id,
            user.status === "approved" ? "pending" : "approved"
          );
          openModal(
            <p>
              Status updated to{" "}
              {user.status === "approved" ? "pending" : "approved"}!
            </p>
          );
        }}
        className="btn-edit"
      >
        Edit Status
      </button>

      <select
        value={user.status}
        onChange={async (e) => {
          const newStatus = e.target.value;
          await editStatus(user.id, newStatus);
          openModal(<p>Status updated to {newStatus}!</p>);
        }}
        className="table-select"
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>


      <button
        onClick={async (e) => {
          e.stopPropagation();
          await editRole(user.id, user.role === "admin" ? "trainee" : "admin");
          openModal(
            <p>
              Role updated to {user.role === "admin" ? "trainee" : "admin"}!
            </p>
          );
        }}
        className="btn-edit"
      >
        Edit Role
      </button>

      <button
        onClick={async (e) => {
          e.stopPropagation();
          if (window.confirm(`Delete user ${user.name}?`)) {
            await deleteUser(user.id);
            openModal(<p>User {user.name} deleted successfully!</p>);
          }
        }}
        className="btn-delete"
      >
        Delete
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/users/${user.id}`);
        }}
        className="btn-nav"
      >
        Open Page
      </button>
    </div>
  );

  const columns: ColumnProps<UserData>[] = [
    { id: "id", caption: "ID", size: 80, isSortable: true },
    { id: "name", caption: "Name", size: 150, isSortable: true },
    { id: "email", caption: "Email", size: 200, isSortable: true },
    { id: "role", caption: "Role", size: 120, isSortable: true, isFilterable: true },
    { id: "status", caption: "Status", size: 120, isSortable: true, isFilterable: true },
    {
      id: "created_at",
      caption: "Created",
      size: 150,
      isSortable: true,
      renderCell: (v) => new Date(v as string).toLocaleDateString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 220,
      renderCell: (_, row) => <ActionsCell user={row} />,
    },
  ];

  const rowRender = (row: UserData, defaultCells: React.ReactNode) => {
    const isExpanded = expandedRow === row.id;
    return (
      <>
        <tr
          className="table-row cursor-pointer hover:bg-gray-50"
          onClick={() => setExpandedRow(isExpanded ? null : row.id)}
        >
          {defaultCells}
        </tr>
        {isExpanded && (
          <tr className="sub-row">
            <td colSpan={columns.length} className="p-0">
              <div className="expanded-content flex gap-4 p-4 border bg-gray-50 w-full items-center">
                {row.avatar_url && (
                  <img
                    src={row.avatar_url}
                    alt={row.name}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <p>
                    <strong>Email:</strong> {row.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {row.role}
                  </p>
                  <p>
                    <strong>Status:</strong> {row.status}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  const updateUrl = (extraSearch: Record<string, any> = {}) => {
    navigate({
      search: {
        page,
        pageSize,
        sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
        ...params,
        ...extraSearch,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    updateUrl({ page: 1, pageSize: newPageSize });
    refresh();
  };

  const handleSortApply = (rules: SortRule[]) => {
    setSortBy(rules);
    updateUrl();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      <DataTable
        columns={columns}
        data={sortedUsers}
        rowRender={rowRender}
        pagination={{
          page: data.current_page,
          pageSize: data.page_size,
          total: data.last_page,
          onPageChange: handlePageChange,
        }}
        initialSort={sortBy}
        onSortApply={handleSortApply}
        tableActionsLeft={
          <div className="flex gap-2">
            <select
              value={params.role || ""}
              onChange={(e) => {
                const value = e.target.value;
                setParams((prev) => {
                  const next = { ...prev };
                  if (!value) delete next.role;
                  else next.role = value;
                  updateUrl({ role: value || undefined, page: 1 });
                  return next;
                });
              }}
              className="table-select"
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="trainee">Trainee</option>
            </select>

            <select
              value={params.status || ""}
              onChange={(e) => {
                const value = e.target.value;
                setParams((prev) => {
                  const next = { ...prev };
                  if (!value) delete next.status;
                  else next.status = value;
                  updateUrl({ status: value || undefined, page: 1 });
                  return next;
                });
              }}
              className="table-select"
            >
              <option value="">All status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="table-select"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        }
        error={error}
        isLoading={loading}
        onRefresh={refresh}
      />

      <Modal
        isOpen={modalOpen}
        title="User Action"
        body={modalContent}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

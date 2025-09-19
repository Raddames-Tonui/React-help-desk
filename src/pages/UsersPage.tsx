
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/users"
import { useUsers } from "@/context/usersContext";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { UserData } from "@/utils/types.ts";
import { ActionsCell } from "@components/ActionsCell.tsx";
import { DataTable } from "@/components/table/DataTable";
import Modal from "@components/Modal.tsx";



export default function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

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
    editRole,
    editStatus,
    deleteUser
  } = useUsers();

  const initialSortFromUrl: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy.split(",").map((s) => {
      const [column, direction = "asc"] = s.trim().split(" ");
      return { column, direction: direction as "asc" | "desc" }
    }) : [{ column: "id", direction: "asc" }];

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);
  const [modalOpen, setModalOpen] = useState(false);
  const [ModalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (content: React.ReactNode) =>{
        setModalContent(content);
        setModalOpen(true);
  }

  useEffect(() => {
    setPage(Number(searchParams.page || 1));
    setPageSize(Number(searchParams.pageSize || 10));

    const backendParams: Record<string, string> = {};
    if (searchParams.role) backendParams.role = String(searchParams.role);
    if (searchParams.status) backendParams.status = String(searchParams.status);
    if (searchParams.page) backendParams.page = String(searchParams.page);
    if (searchParams.pageSize) backendParams.pageSize = String(searchParams.pageSize);
  }, [searchParams, setPage, setPageSize, setParams]);

  const sortedUsers = useMemo(() => sortData(users, sortBy), [users, sortBy]);

  const renderActionsCell = (user: UserData) => {
        const handleOpenModal = (content: React.ReactNode) => {
            setModalContent(content);
            setModalOpen(true);
        };

        const handleEditRole = () => {
            handleOpenModal(
                <div className="flex flex-col gap-4">
                    <h3>Edit Role</h3>
                    <select
                        value={user.role}
                        onChange={(e) => editRole(user.id, e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="admin">Admin</option>
                        <option value="trainee">Trainee</option>
                    </select>
                </div>
            );
        };

        const handleEditStatus = () => {
            handleOpenModal(
                <div className="flex flex-col gap-4">
                    <h3>Edit Status</h3>
                    <select
                        value={user.status}
                        onChange={(e) => editStatus(user.id, e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            );
        };

        const handleDelete = () => {
            handleOpenModal(
                <div className="flex flex-col gap-4">
                    <h3>Are you sure?</h3>
                    <div className="flex gap-4">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                deleteUser(user.id);
                                setModalOpen(false);
                            }}
                        >
                            Yes, Delete
                        </button>
                        <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex gap-2">
                <button onClick={handleEditRole} className="text-blue-500 underline">
                    Edit Role
                </button>
                <button onClick={handleEditStatus} className="text-green-500 underline">
                    Edit Status
                </button>
                <button onClick={handleDelete} className="text-red-500 underline">
                    Delete
                </button>
            </div>
        );
    };

  const columns: ColumnProps<UserData>[] = [
    { id: "id", caption: "ID", size: 80, isSortable: true },
    { id: "name", caption: "Name", size: 150, isSortable: true },
    { id: "email", caption: "Email", size: 200, isSortable: true },
    { id: "role", caption: "Role", size: 120, isSortable: true, isFilterable: true },
    { id: "status", caption: "Status", size: 120, isSortable: true, isFilterable: true },
    {
      id: "created_at",
      caption: "Created",
      size: 120,
      isSortable: true,
      renderCell: (v) => new Date(v as string).toLocaleDateString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 200,
      renderCell: (_, row) => renderActionsCell(row),
    }
  ]

    // Updating page url with params
    const updateUrl = (extraSearch: Record<string, any> ={}): void => {
      navigate({
          search: {
              page,
              pageSize,
              sortBy: sortBy.map((r) => `$r.column ${r.direction}`).join(","),
              ...params,
              ...extraSearch,
          }
      })
    }

    const handleSortApply = (rules: SortRule[]) => {
        setSortBy(rules);
        updateUrl();
        refresh();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrl({ page: newPage });
        refresh();
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
        updateUrl({ page: 1, pageSize: newPageSize });
        refresh();
    };

  return (
    <div>
        <DataTable
            columns={columns}
            data={sortedUsers}
            loading={loading}
            error={error}
            onRefresh={refresh}

            initialSort={sortBy}
            onSortApply={handleSortApply}
            pagination={{
                page: data?.current_page,
                pageSize: data?.page_size,
                total: data?.last_page,
                onPageChange: handlePageChange,
            }}
        />

        <Modal
            isOpen={modalOpen}
            title="Action"
            body={ModalContent}
            onClose={() => setModalOpen(false)}
        />

    </div>
  );
};


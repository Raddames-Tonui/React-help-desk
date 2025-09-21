import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/users";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { UserData } from "@/context/types.ts";
import { DataTable } from "@/components/table/DataTable";
import { useUsers } from "@/hooks/hooks.tsx";
import UserActions from "@/components/UserActions"; 

export default function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const {
    users,
    data,
    isLoading,
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
    deleteUser,
  } = useUsers();

  const initialSortFromUrl: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy.split(",").map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" };
      })
    : [];

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);

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

  const usersColumns: ColumnProps<UserData>[] = [
    { id: "id", caption: "ID", size: 5, isSortable: true },
    { id: "name", caption: "Name", size: 150, isSortable: true },
    { id: "email", caption: "Email", size: 200, isSortable: true },
    { id: "role", caption: "Role", size: 120, isSortable: true, isFilterable: true },
    {
      id: "status",
      caption: "Status",
      size: 120,
      isSortable: true,
      isFilterable: true,
      renderCell: (value) => (
        <span
          style={{
            backgroundColor:
              value === "rejected"
                ? "#a81d1dff"
                : value === "approved"
                ? "green"
                : value === "pending"
                ? "#cbe505ff"
                : "inherit",
            padding: value === "approved" ? "3px 1rem" : "3px 1.35rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {value}
        </span>
      ),
    },
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
      renderCell: (_, row) => (
        <UserActions
          user={row}
          editRole={editRole}
          editStatus={editStatus}
          deleteUser={deleteUser}
        />
      ),
    },
  ];

  // Updating page url with params
  const updateUrl = (extraSearch: Record<string, any> = {}): void => {
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

  const handleSortApply = (rules: SortRule[]) => {
    setSortBy(rules);
    updateUrl();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };




  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
      </div>
      <div className="table-wrapper">
        <DataTable
          columns={usersColumns}
          data={sortedUsers}
          isLoading={isLoading}
          error={error}
          onRefresh={refresh}
          initialSort={sortBy}
          onSortApply={handleSortApply}
          pagination={{
            page: data?.current_page,
            pageSize: data?.page_size,
            total: data?.total_count,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
}

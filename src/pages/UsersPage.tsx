// src/pages/UsersPage.tsx
import React from "react";
import { useUsers } from "@/context/usersContext";
import { DataTable} from "@/components/table/DataTable";
import type { ColumnProps } from "@/components/table/DataTable";

export default function UsersPage() {
  const {
    users,
    data,
    loading,
    error,
    page,
    pageSize,
    setPage,
  } = useUsers();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data || users.length === 0) return <p>No data available.</p>;

  // Define columns for DataTable
  const columns: ColumnProps<typeof users[0], any>[] = [
    { id: "id", caption: "ID", size: 80 },
    {
      id: "avatar_url",
      caption: "Avatar",
      size: 100,
      renderCell: (value, row) => (
        <img
          src={value as string}
          alt={row.name}
          className="w-8 h-8 rounded-full"
        />
      ),
    },
    { id: "name", caption: "Name", size: 150 },
    { id: "email", caption: "Email", size: 200 },
    { id: "role", caption: "Role", size: 120 },
    { id: "status", caption: "Status", size: 120 },
    {
      id: "created_at",
      caption: "Created",
      size: 150,
      renderCell: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      <DataTable
        columns={columns}
        data={users}
        pagination={{
          page,
          pageSize,
          total: data.total,
          onPageChange: setPage,
        }}
        error={error}
        isLoading={loading}
          />
          

          <DataTable
              columns={columns}
              data={users}
              pagination={{
                  page,
                  pageSize,
                  total: data.total,
                  onPageChange: setPage,
              }}
              error={error}
              isLoading
          />
    </div>
  );
}

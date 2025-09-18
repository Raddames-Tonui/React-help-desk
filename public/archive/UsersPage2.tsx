// src/pages/UsersPage.tsx
import React from "react";
import { useUsers } from "@/context/usersContext";

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

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      {/* Users Table */}
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Avatar</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{u.id}</td>
              <td className="border px-3 py-2">
                <img
                  src={u.avatar_url}
                  alt={u.name}
                  className="w-8 h-8 rounded-full"
                />
              </td>
              <td className="border px-3 py-2">{u.name}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.role}</td>
              <td className="border px-3 py-2">{u.status}</td>
              <td className="border px-3 py-2">
                {new Date(u.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex gap-2 items-center">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil((data?.total ?? 0) / pageSize)}
        </span>
        <button
          onClick={() =>
            setPage(Math.min(page + 1, Math.ceil((data?.total ?? 0) / pageSize)))
          }
          disabled={page >= Math.ceil((data?.total ?? 0) / pageSize)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

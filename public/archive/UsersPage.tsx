// src/pages/UsersPage.tsx
import { DataTable } from "@/components/table/DataTable";
import React, { useEffect, useState } from "react";

const TOKEN = "0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  avatar_url: string;
  created_at: string;
};

type ApiResponse = {
  domain: string;
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
  records: User[];
};

export default function UsersPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users/?page=${page}&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${"0b008ea4-07fa-435f-906d-76f134078e3d-mdcedoc7"}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>No data available.</p>;

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
          {data.records.map((u) => (
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
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {data.current_page} of {data.last_page}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, data.last_page))}
          disabled={page === data.last_page}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

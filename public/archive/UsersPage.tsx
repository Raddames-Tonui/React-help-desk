import type { ApiResponse, UserData } from "@/context/types";
import { useFetchData } from "@/hooks/useFetchData"; // ← path where you put it
import { TOKEN } from "@/context/hooks";
import { DataTable, type ColumnProps } from "@/components/table/DataTable";

export default function UsersPage() {
  
  const {
    data,
    isLoading,
    error,
    refresh,
  } = useFetchData<ApiResponse<UserData>>({
    url: "/api/admin/users",
    token: TOKEN,
    params: {},
  });

  const users = data?.records ?? [];

  const usersColumns: ColumnProps<UserData>[] = [{ id: "id", caption: "ID", size: 5, isSortable: true }, { id: "name", caption: "Name", size: 150, isSortable: true }, { id: "email", caption: "Email", size: 200, isSortable: true }, { id: "role", caption: "Role", size: 120, isSortable: true, isFilterable: true }, { id: "status", caption: "Status", size: 120, isSortable: true, isFilterable: true, renderCell: (value) => (<span style={{ backgroundColor: value === "rejected" ? "#a81d1dff" : value === "approved" ? "green" : value === "pending" ? "#cbe505ff" : "inherit", padding: value === "approved" ? "3px 1rem" : "3px 1.35rem", fontWeight: "bold", color: "white", }} > {value} </span>), }, { id: "created_at", caption: "Created", size: 120, isSortable: true, renderCell: (v) => new Date(v as string).toLocaleDateString(), },];

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
      </div>
      <div className="table-wrapper">
        <DataTable
          columns={usersColumns}
          data={users}
          isLoading={isLoading}
          error={error}
          onRefresh={refresh}
          pagination={{
            page: 1,
            pageSize: 10,
            total: data?.total_count ?? 0,
            onPageChange: () => { },
          }}
        />
      </div>
    </div>
  );
}
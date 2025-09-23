import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/users";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ApiResponse, UserData } from "@/context/types";
import type { ColumnProps, SortRule, FilterRule } from "@/components/table/DataTable";
import { DataTable } from "@/components/table/DataTable";
import { useFetchData } from "@/hooks/useFetchData";
import { TOKEN } from "@/context/hooks";
import UserActions from "./UserActions";

export default function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // --- Parse initial sort from URL (frontend only) ---
  const initialSort: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy
      .split(",")
      .filter(Boolean)
      .map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" };
      })
    : [];

  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialPageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 10;

  // --- Parse initial filters from URL (backend) ---
  const initialFilters: FilterRule[] = [];
  if (searchParams.role) initialFilters.push({ column: "role", operator: "eq", value: String(searchParams.role) });
  if (searchParams.status) initialFilters.push({ column: "status", operator: "eq", value: String(searchParams.status) });

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [filters, setFilters] = useState<FilterRule[]>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // --- Build backend params from filters ---
  const backendParams: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };
  filters.forEach((f) => (backendParams[f.column] = f.value));

  const { data, isLoading, error, refresh } = useFetchData<ApiResponse<UserData>>({
    url: "/api/admin/users",
    token: TOKEN,
    params: backendParams,
  });

  const users = data?.records ?? [];

  // --- Frontend sorting ---
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
      renderCell: (_, row) => <UserActions user={row} onRefresh={refresh} />,
    },
  ];

  // --- Sync state to URL ---
  const updateUrl = useCallback(() => {
    navigate({
      search: {
        page,
        pageSize,
        sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
        ...filters.reduce((acc, f) => ({ ...acc, [f.column]: f.value }), {}),
      },
    });
  }, [navigate, page, pageSize, sortBy, filters]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // --- Handlers ---
  const handleSortApply = (rules: SortRule[]) => setSortBy(rules);

  const handleFilterApply = (rules: FilterRule[]) => {
    setFilters(rules);
    setPage(1); // reset page when filter changes
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Page size dropdown
  const tableActionsRight = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label htmlFor="pageSizeSelect"></label>
      <select
        id="pageSizeSelect"
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="button-sec"
        style={{ padding: "0.4rem 1rem " }}
      >
        {[5, 10, 20].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );

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
          initialFilter={filters}
          onSortApply={handleSortApply}
          onFilterApply={handleFilterApply}
          tableActionsRight={tableActionsRight}
          pagination={{
            page,
            pageSize,
            total: data?.total_count ?? 0,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
}

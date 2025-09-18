// src/pages/UsersPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useUsers } from "@/context/usersContext";
import { DataTable } from "@/components/table/DataTable";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import { Route } from "@/routes/_protected/admin/users";
import { sortData } from "@/components/table/utils/tableUtils";

export default function UsersPage(): React.FC {
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
    } = useUsers();

    // ----- Client-side sorting state -----
    const initialSortFromUrl: SortRule[] = searchParams.sortBy
        ? searchParams.sortBy.split(",").map((s) => {
            const [column, direction = "asc"] = s.trim().split(" ");
            return { column, direction: direction as "asc" | "desc" };
        })
        : [{ column: "id", direction: "asc" }];

    const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);

    // ----- Initialize backend filter params from URL -----
    useEffect(() => {
        setPage(Number(searchParams.page) || 1);
        setPageSize(Number(searchParams.pageSize) || 10);

        const backendParams: Record<string, string> = {};
        if (searchParams.role) backendParams.role = String(searchParams.role);
        if (searchParams.status) backendParams.status = String(searchParams.status);

        setParams(backendParams);
    }, [searchParams, setPage, setPageSize, setParams]);

    // ----- Client-side sorted users -----
    const sortedUsers = useMemo(() => sortData(users, sortBy), [users, sortBy]);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!data || users.length === 0) return <p>No data available.</p>;

    const columns: ColumnProps<typeof users[0]>[] = [
        { id: "id", caption: "ID", size: 80, isSortable: true, isFilterable: false },
        {
            id: "avatar_url",
            caption: "Avatar",
            size: 100,
            renderCell: (v, r) => <img src={v as string} alt={r.name} className="h-8 w-8 rounded-full" />,
            isFilterable: false,
        },
        { id: "name", caption: "Name", size: 150, isSortable: true, isFilterable: false },
        { id: "email", caption: "Email", size: 200, isSortable: true, isFilterable: false },
        { id: "role", caption: "Role", size: 120, isSortable: true, isFilterable: true },
        { id: "status", caption: "Status", size: 120, isSortable: true, isFilterable: true },
        {
            id: "created_at",
            caption: "Created",
            size: 150,
            isSortable: true,
            isFilterable: false,
            renderCell: (v) => new Date(v as string).toLocaleDateString(),
        },
    ];

    // ----- Pagination -----
    function handlePageChange(newPage: number) {
        setPage(newPage);
        navigate({
            search: {
                page: newPage,
                pageSize,
                sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
                ...params,
            },
        });
    }

    function handlePageSizeChange(newPageSize: number) {
        setPageSize(newPageSize);
        setPage(1);
        navigate({
            search: {
                page: 1,
                pageSize: newPageSize,
                sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
                ...params,
            },
        });
    }

    // ----- Sorting handler (client-side) -----
    function handleSortApply(rules: SortRule[]) {
        setSortBy(rules);
        navigate({
            search: {
                page,
                pageSize,
                sortBy: rules.map((r) => `${r.column} ${r.direction}`).join(","),
                ...params,
            },
        });
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Users</h1>

            <DataTable
                columns={columns}
                data={sortedUsers}
                pagination={{
                    page: data.current_page,
                    pageSize: data.page_size,
                    total: data.last_page,
                    onPageChange: handlePageChange,
                }}
                initialSort={sortBy}
                onSortApply={handleSortApply}
                tableActionsLeft={
                    <div className="">
                        {/* Role filter */}
                        <select
                            value={params.role || ""}
                            onChange={(e) => setParams((prev) => ({ ...prev, role: e.target.value }))}
                            className="table-select"
                        >
                            <option value="">All roles</option>
                            <option value="admin">Admin</option>
                            <option value="trainee">Trainee</option>
                        </select>

                        {/* Status filter */}
                        <select
                            value={params.status || ""}
                            onChange={(e) => setParams((prev) => ({ ...prev, status: e.target.value }))}
                            className="table-select"
                        >
                            <option value="">All status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Page size */}
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
        </div>
    );
}

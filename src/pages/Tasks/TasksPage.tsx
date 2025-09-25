import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { TaskData } from "@/context/types.ts";
import { DataTable } from "@/components/table/DataTable";
import { useQuery } from "@tanstack/react-query";
import { TOKEN } from "@/utils/Constants";
import { Route } from "@/routes/_protected/admin/subjects/$subjectId/tasks";
import TaskActions from "@/pages/Tasks/TaskActions";

export default function TasksPage() {
  const navigate = useNavigate();
  const params = Route.useParams();  // Get ($subjectId)
  const subjectId = Number(params.subjectId);
  const search = Route.useSearch();

  const initialPage = search.page ? Number(search.page) : 1;
  const initialPageSize = search.pageSize ? Number(search.pageSize) : 10;
  const initialSortFromUrl: SortRule[] = search.sortBy
    ? (search.sortBy as string)
      .split(",")
      .filter(Boolean)
      .map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" };
      })
    : [];

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);

  const updateUrl = useCallback(() => {
    navigate({
      search: {
        page,
        pageSize,
        sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
      },
    });
  }, [navigate, page, pageSize, sortBy]);

  const fetchTasks = async ({ page, pageSize, subjectId }: {
    page: number;
    pageSize: number;
    subjectId: number;
  }) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());
    params.append("subject_id", subjectId.toString());

    const res = await fetch(`/api/admin/tasks/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  };

  const { data: tasksData, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", subjectId],
    queryFn: () => fetchTasks({ page, pageSize, subjectId }),
  });

  const sortedTasks = useMemo(() => {
    const tasks = tasksData?.records || [];
    return sortData(tasks, sortBy);
  }, [tasksData, sortBy]);

  const tasksColumns: ColumnProps<TaskData>[] = [
    { id: "id", caption: "ID", size: 5, isSortable: true },
    { id: "title", caption: "Title", size: 150, isSortable: true },
    { id: "description", caption: "Description", size: 200 },
    { id: "requirements", caption: "Requirements", size: 200 },
    {
      id: "due_date",
      caption: "Due Date",
      size: 120,
      isSortable: true,
      renderCell: (v) => new Date(v as string).toLocaleDateString(),
    },
    { id: "max_score", caption: "Max Score", size: 100, isSortable: true, align: "center" },
    {
      id: "is_active",
      caption: "Active",
      size: 100,
      isSortable: true,
      renderCell: (value) => (
        <span
          style={{
            color: value ? "green" : "red",
            padding: "3px 1rem",
            fontWeight: "bold",
          }}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    { id: "created_by_name", caption: "Created By", size: 120, isSortable: true, hide: true },
    {
      id: "created_at",
      caption: "Created",
      size: 120,
      isSortable: true,
      hide: true,
      renderCell: (v) => new Date(v as string).toLocaleDateString(),
    },
    {
      id: "actions",
      caption: "Actions",
      size: 200,
      align: "left",
      renderCell: (_, row) => <TaskActions task={row} />,
    },
  ];



  useEffect(() => updateUrl(), [updateUrl]);

  return (
    <div>
      <div className="page-header">
        <h1>{`Tasks for Subject ${subjectId}`}</h1>
      </div>

      <div className="table-wrapper">
        <DataTable
          columns={tasksColumns}
          data={sortedTasks}
          isLoading={isLoading}
          error={error}
          onRefresh={() => refetch()}
          initialSort={sortBy}
          onSortApply={setSortBy}
          enableFilter={false}
          pagination={{
            page: tasksData?.current_page,
            pageSize: tasksData?.page_size,
            total: tasksData?.total_count,
            onPageChange: setPage,
          }}
          tableActionsRight={
            <div>
              <label htmlFor="pageSizeSelect">Page size: </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="button-sec"
                style={{ padding: "0.4rem 1rem " }}
              >
                {[3, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          }

        />
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/tasks";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { TaskData, TaskPayload } from "@/context/types.ts";
import { DataTable } from "@/components/table/DataTable";
import { useTasks } from "@/context/hooks";
import TaskActions from "@/pages/Tasks/TaskActions";
import Modal from "@/components/Modal";
import TaskForm from "@/pages/Tasks/TaskForm";

export default function TasksPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const {
    tasks,
    tasksData,
    isLoading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh,
    deleteTask,
    updateTask,
    createTask,
  } = useTasks();

  const initialSortFromUrl: SortRule[] = searchParams.sortBy
    ? searchParams.sortBy
      .split(",")
      .filter(Boolean)
      .map((s) => {
        const [column, direction = "asc"] = s.trim().split(" ");
        return { column, direction: direction as "asc" | "desc" };
      }) : [];


  const initialPage = searchParams.page ? Number(searchParams.page) : 1;
  const initialPageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 10;

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);

  useEffect(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);

    // const backendParams: Record<string, string> = {};
    // setParams(backendParams);
  }, []);

  const sortedTasks = useMemo(() => sortData(tasks, sortBy), [tasks, sortBy]);



  const tasksColumns: ColumnProps<TaskData>[] = [
    { id: "id", caption: "ID", size: 5, isSortable: true },
    { id: "title", caption: "Title", size: 150, isSortable: true },
    {
      id: "description", caption: "Description", size: 200
    },
    {
      id: "requirements", caption: "Requirements", size: 200,
    },
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
    {
      id: "created_by_name",
      caption: "Created By",
      size: 120,
      isSortable: true,
      hide: true,

    },
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
      renderCell: (_, row) => (
        <TaskActions task={row} updateTask={updateTask} deleteTask={deleteTask} />
      ),
    },
  ];

  const updateUrl = useCallback(() => {
    navigate({
      search: {
        page,
        pageSize,
        sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
      }
    })
  }, [navigate, page, pageSize, sortBy]);

  const handleSortApply = (rules: SortRule[]) => {
    setSortBy(rules);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }

  const tableActionsRight = (
    <div>
      <label htmlFor="pageSizeSelect"></label>
      <select
        id="pageSizeSelect"
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="button-sec"
        style={{ padding: "0.4rem 1rem " }}
      >
        {[5, 10, 15, 20].map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
  );

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
      </div>

      <div className="table-wrapper">
        <DataTable
          columns={tasksColumns}
          data={sortedTasks}
          isLoading={isLoading}
          error={error}
          onRefresh={refresh}
          initialSort={sortBy}
          onSortApply={handleSortApply}
          pagination={{
            page: tasksData?.current_page,
            pageSize: tasksData?.page_size,
            total: tasksData?.total_count,
            onPageChange: handlePageChange,
          }}
          tableActionsRight={tableActionsRight}
        />
      </div>


    </div>
  );
}

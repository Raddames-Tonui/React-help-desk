import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/tasks";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { TaskData, TaskPayload } from "@/context/types.ts";
import { DataTable } from "@/components/table/DataTable";
import { useTasks } from "@/hooks/hooks.tsx";
import TaskActions from "@/components/TaskActions";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";

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
    params,
    setPage,
    setPageSize,
    setParams,
    refresh,
    deleteTask,
    updateTask,
    createTask,
  } = useTasks();

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
    if (searchParams.page) backendParams.page = String(searchParams.page);
    if (searchParams.pageSize) backendParams.pageSize = String(searchParams.pageSize);
    if (searchParams.subject_id) backendParams.subject_id = String(searchParams.subject_id);

    setParams(backendParams);
  }, [searchParams, setPage, setPageSize, setParams]);

  const sortedTasks = useMemo(() => sortData(tasks, sortBy), [tasks, sortBy]);

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
    { id: "max_score", caption: "Max Score", size: 100, isSortable: true },
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
      renderCell: (_, row) => (
        <TaskActions task={row} updateTask={updateTask} deleteTask={deleteTask} />
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
        subject_id: searchParams.subject_id,
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

  // Modal state for creating task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayload, setNewPayload] = useState<TaskPayload>({
    subject_id: Number(searchParams.subject_id || 0),
    title: "",
    description: "",
    requirements: "",
    due_date: "",
    max_score: 0,
    is_active: true,
  });

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
        <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>
          Create Task
        </button>
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
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Create Task"
        body={<TaskForm onChange={setNewPayload} />}
        footer={
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              className="modal-close-btn"
              onClick={() => {
                createTask(newPayload);
                setIsModalOpen(false);
              }}
            >
              Create
            </button>
            <button className="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        }
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

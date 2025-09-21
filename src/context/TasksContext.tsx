import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { ApiResponse, TaskData, TaskPayload } from "@/context/types.ts";
import {
  TasksContext,
  type TasksContextValue,
  TOKEN,
} from "@/hooks/hooks.tsx";

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasksData, setTasksData] = useState<ApiResponse<TaskData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<Record<string, string>>({});
  const [reload, setReload] = useState(false);

  const refresh = () => setReload((s) => !s);

  // ---------- Fetch all tasks ----------
  const fetchTasks = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);

        const query = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
          ...params,
        }).toString();

        const res = await fetch(`/api/admin/tasks/?${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          signal,
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || `Failed to fetch tasks (status ${res.status})`);
        }

        setTasksData(json);
      } catch (error) {
        if ((error as any).name === "AbortError") return;
        setError(error instanceof Error ? error.message : "Unknown error");
        setTasksData(null);
        toast.error("Failed to fetch tasks");
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, params]
  );

  // ---------- Auto fetch ----------
  useEffect(() => {
    const ac = new AbortController();
    fetchTasks(ac.signal);
    return () => ac.abort();
  }, [fetchTasks, reload]);

  // ---------- Fetch by subject ----------
  const fetchTasksBySubject = async (subjectId: number): Promise<TaskData[] | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/tasks/?subject_id=${subjectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Failed to fetch tasks (status ${res.status})`);
      }

      return json.records as TaskData[];
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to fetch tasks by subject");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Fetch single ----------
  const fetchSingleTask = async (taskId: number): Promise<TaskData | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Failed to fetch task (status ${res.status})`);
      }

      return json.task as TaskData;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error("Failed to fetch task");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Create ----------
  const createTask = async (payload: TaskPayload): Promise<TaskData | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Failed to create task (status ${res.status})`);
      }

      toast.success("Task created successfully");
      refresh();
      return json.task as TaskData;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Failed to create task");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Update ----------
  const updateTask = async (taskId: number, payload: TaskPayload): Promise<TaskData | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Failed to update task (status ${res.status})`);
      }

      toast.success("Task updated successfully");
      refresh(); 
      return json.task as TaskData;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Failed to update task");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Delete ----------
  const deleteTask = async (taskId: number): Promise<string> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || `Failed to delete task (status ${res.status})`);
      }

      toast.success("Task deleted");
      refresh(); 
      return json.message || "Task deleted successfully";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: TasksContextValue = {
    tasksData,
    tasks: tasksData?.records ?? [],
    isLoading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
    fetchTasksBySubject,
    fetchSingleTask,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

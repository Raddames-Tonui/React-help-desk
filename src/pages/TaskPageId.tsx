import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as TaskRoute } from "@/routes/_protected/admin/tasks/$taskId";
import type { SingleTaskData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import { useTasks } from "@/hooks/hooks.tsx";

function TaskPageId() {
  const { taskId } = useParams({ from: TaskRoute.id });
  const { fetchSingleTask, isLoading: contextLoading, error: contextError } = useTasks();

  const [task, setTask] = useState<SingleTaskData["task"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;
    let isMounted = true;

    const fetchTask = async () => {
      setLoading(true);
      try {
        const taskData = await fetchSingleTask(Number(taskId));
        if (!isMounted) return;

        if (!taskData) {
          setError("Task not found");
        } else {
          setTask(taskData);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load task");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTask();
    return () => {
      isMounted = false;
    };
  }, [taskId, fetchSingleTask]);

  if (loading || contextLoading) return <Loader />;
  if (error || contextError) return <div className="task-error">{error || contextError}</div>;
  if (!task) return <div className="task-empty">No task data available</div>;

  return (
    <div className="task-container">
      <div className="task-details">
        <h2 className="task-title">{task.title}</h2>

        <p><strong>Description:</strong></p>
        <p>{task.description}</p>

        <p><strong>Requirements:</strong></p>
        <p>{task.requirements}</p>

        <p><strong>Due Date:</strong></p>
        <p>{new Date(task.due_date).toLocaleDateString()}</p>

        <p><strong>Max Score:</strong></p>
        <p>{task.max_score}</p>

        <p><strong>Subject:</strong></p>
        <p>{task.subject_name}</p>

        <p><strong>Status:</strong></p>
        <p>{task.is_active ? "Active" : "Inactive"}</p>

        <p><strong>Created By:</strong></p>
        <p>{task.created_by_name}</p>

        <p><strong>Created At:</strong></p>
        <p>{new Date(task.created_at).toLocaleString()}</p>

        <p><strong>Updated At:</strong></p>
        <p>{new Date(task.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default TaskPageId;

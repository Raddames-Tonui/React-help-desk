import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as TaskRoute } from "@/routes/_protected/admin/tasks/$taskId";
import type { SingleTaskData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import { useTasks } from "@/context/hooks";

import "@/css/userspage.css";


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
    <div className="page-container">
      <div className="page-header">
        <h1 className="task-title">Task page</h1>
      </div>
      <div className="s-page-container">
        <div className="s-page-details">

          <dl>
            <h2 className="s-page-title">{task.title}</h2>

            <dt>Description:</dt>
            <dd>{task.description}</dd>

            <dt>Requirements:</dt>
            <dd>{task.requirements}</dd>

            <dt>Due Date:</dt>
            <dd>{new Date(task.due_date).toLocaleDateString()}</dd>

            <dt>Max Score:</dt>
            <dd>{task.max_score}</dd>

            <dt>Subject:</dt>
            <dd>{task.subject_name}</dd>

            <dt>Status:</dt>
            <dd>{task.is_active ? "Active" : "Inactive"}</dd>

            <dt>Created By:</dt>
            <dd>{task.created_by_name}</dd>

            <dt>Created At:</dt>
            <dd>{new Date(task.created_at).toLocaleString()}</dd>

            <dt>Updated At:</dt>
            <dd>{new Date(task.updated_at).toLocaleString()}</dd>
          </dl>
        </div>
      </div>

    </div>
  );
}

export default TaskPageId;

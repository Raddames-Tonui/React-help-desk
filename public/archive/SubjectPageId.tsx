import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as SubjectRoute } from "@/routes/_protected/admin/subjects/$subjectId";
import type { SingleSubjectData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import Modal from "@/components/Modal";
import TaskForm from "@/pages/Tasks/TaskForm";

import { useSubjects, useTasks } from "@/context/hooks";
import toast from "react-hot-toast";

import "@/css/userspage.css";
import "@/css/index.css";

function SubjectPageId() {
  const { subjectId } = useParams({ from: SubjectRoute.id });
  const { fetchSingleSubject, isLoading: contextLoading, error: contextError } = useSubjects();
  const { createTask } = useTasks();

  const [subject, setSubject] = useState<SingleSubjectData["subject"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayload, setNewPayload] = useState<any>({});

  useEffect(() => {
    if (!subjectId) return;
    let isMounted = true;

    const fetchSubject = async () => {
      setLoading(true);
      try {
        const subjectData = await fetchSingleSubject(Number(subjectId));
        if (!isMounted) return;

        if (!subjectData) {
          setError("Subject not found");
        } else {
          setSubject(subjectData.subject);
        }
      } catch {
        if (isMounted) setError("Failed to load subject");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubject();
    return () => {
      isMounted = false;
    };
  }, [subjectId, fetchSingleSubject]);

  const handleTaskCreate = async () => {
    if (!subjectId) return;

    const task = await createTask({ ...newPayload, subject_id: Number(subjectId) });
    if (task) {
      toast.success("Task created successfully!");
      setIsModalOpen(false);
    }
  };

  if (loading || contextLoading) return <Loader />;
  if (error || contextError) return <div className="subject-error">{error || contextError}</div>;
  if (!subject) return <div className="subject-empty">No subject data available</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="task-title">Subject Page</h1>
        <button className="button-sec" onClick={() => setIsModalOpen(true)}>
          Create Task
        </button>
      </div>

      <div className="s-page-container">
        <div className="s-page-details">
          <h2 className="s-page-title">{subject.name}</h2>
          <dl>
            <dt>Description:</dt>
            <dd>{subject.description}</dd>

            <dt>Created By:</dt>
            <dd>{subject.created_by_name}</dd>

            <dt>Status:</dt>
            <dd>{subject.is_active ? "Active" : "Inactive"}</dd>

            <dt>Created At:</dt>
            <dd>{new Date(subject.created_at).toLocaleString()}</dd>

            <dt>Updated At:</dt>
            <dd>{new Date(subject.updated_at).toLocaleString()}</dd>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Create Task"
        body={<TaskForm subjectId={Number(subjectId)} initialData={undefined} onChange={setNewPayload} />}
        footer={
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
     
          </div>
        }
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default SubjectPageId;

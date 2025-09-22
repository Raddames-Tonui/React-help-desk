import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as SubjectRoute } from "@/routes/_protected/admin/subjects/$subjectId";
import type { SingleSubjectData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import { useSubjects } from "@/hooks/hooks.tsx";

import "@/css/userspage.css";


function SubjectPageId() {
  const { subjectId } = useParams({ from: SubjectRoute.id });
  const { fetchSingleSubject, isLoading: contextLoading, error: contextError } =
    useSubjects();

  const [subject, setSubject] = useState<SingleSubjectData["subject"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (isMounted) {
          setError("Failed to load subject");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubject();
    return () => {
      isMounted = false;
    };
  }, [subjectId, fetchSingleSubject]);

  if (loading || contextLoading) return <Loader />;
  if (error || contextError) return <div className="subject-error">{error || contextError}</div>;
  if (!subject) return <div className="subject-empty">No subject data available</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="task-title">Subject Page</h1>
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
    </div>
  );
}

export default SubjectPageId;

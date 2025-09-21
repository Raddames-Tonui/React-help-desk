import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as SubjectRoute } from "@/routes/_protected/admin/subjects/$subjectId";
import type { SingleSubjectData } from "@/context/types.ts";

import Loader from "@/components/Loader.tsx";
import { useSubjects } from "@/hooks/hooks.tsx";

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
    <div className="subject-container">
      <div className="subject-details">
        <h2 className="subject-title">{subject.name}</h2>

        <p><strong>Description:</strong></p>
        <p>{subject.description}</p>

        <p><strong>Created By:</strong></p>
        <p>{subject.created_by_name}</p>

        <p><strong>Status:</strong></p>
        <p>{subject.is_active ? "Active" : "Inactive"}</p>

        <p><strong>Created At:</strong></p>
        <p>{new Date(subject.created_at).toLocaleString()}</p>

        <p><strong>Updated At:</strong></p>
        <p>{new Date(subject.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default SubjectPageId;

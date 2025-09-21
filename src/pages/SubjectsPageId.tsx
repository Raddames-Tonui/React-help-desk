import { useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { Route as SubjectRoute } from "@/routes/_protected/admin/subjects.$subjectId";
import { useSubjects } from "@/hooks/hooks";
import type { SingleSubjectData } from "@/context/types";

const SubjectsPageId: React.FC = () => {
  const { subjectId } = useParams({ from: SubjectRoute.id });
  const { fetchSingleSubject } = useSubjects();

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
          setSubject(null);
        } else {
          setSubject(subjectData.subject);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubject();

    return () => {
      isMounted = false;
    };
  }, [subjectId, fetchSingleSubject]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!subject) return <p>No subject found</p>;

  return (
    <div>
      <h2>{subject.name}</h2>
      <p>{subject.description}</p>
      <p>
        Created by {subject.created_by_name} at {new Date(subject.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default SubjectsPageId;

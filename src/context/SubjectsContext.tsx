import type {
  ApiResponse,
  SingleSubjectData,
  SubjectData,
  SubjectPayload,
} from "@/context/types.ts";
import React, { useEffect, useState, useCallback } from "react";
import { SubjectContext, type SubjectContextValue, TOKEN } from "@/hooks/hooks.tsx";
import toast from "react-hot-toast";

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjectData, setSubjectData] = useState<ApiResponse<SubjectData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [params, setParams] = useState<Record<string, string>>({});
  const [reload, setReload] = useState(false);

  const fetchSubjects = useCallback(
    async (signal: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);

        const query = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          ...params,
        }).toString();

        const res = await fetch(`/api/admin/subjects/?${query}`, {
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
          throw new Error(
            json.message || `Failed to fetch subjects (status ${res.status})`
          );
        }

        setSubjectData(json);
      } catch (error) {
        if ((error as any).name === "AbortError") return;
        const msg = error instanceof Error ? error.message : "Unknown error";
        setError(msg);
        setSubjectData(null);
        toast.error(`Error fetching subjects: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, params]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchSubjects(ac.signal);
    return () => ac.abort();
  }, [fetchSubjects, reload]);

  const refresh = () => setReload((s) => !s);

    const fetchSingleSubject = async (
        subjectId: number
    ): Promise<SingleSubjectData | null> => {
        try {
            const res = await fetch(`/api/admin/subjects/${subjectId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    Accept: "application/json",
                },
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || `Failed to fetch subject (status ${res.status})`);
            }

            return json as SingleSubjectData;
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Error fetching subject: ${msg}`);
            throw error;
        }
    };

  const createSubject = async (
    payload: SubjectPayload
  ): Promise<SingleSubjectData | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/subjects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || `Failed to create subject (status ${res.status})`
        );
      }

      toast.success("Subject created successfully");
      refresh();

      return json as SingleSubjectData;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setError(msg);
      toast.error(`Error creating subject: ${msg}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubject = async (
    subjectId: number,
    payload: SubjectPayload
  ): Promise<SingleSubjectData | null> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || `Failed to edit subject (status ${res.status})`
        );
      }

      toast.success("Subject updated successfully");
      refresh();

      return json as SingleSubjectData;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setError(msg);
      toast.error(`Error updating subject: ${msg}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubject = async (subjectId: number): Promise<string> => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || `Failed to delete subject (status ${res.status})`
        );
      }

      toast.success("Subject deleted");
      refresh();

      return json.message || "Subject deleted successfully";
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setError(msg);
      toast.error(`Error deleting subject: ${msg}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubjectContextValue = {
    subjectData,
    subjects: subjectData?.records ?? [],
    isLoading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,

    fetchSingleSubject,
    createSubject,
    updateSubject,
    deleteSubject,
  };

  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  );
};

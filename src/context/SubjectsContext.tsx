import type { ApiResponse, SubjectData } from "@/context/types.ts";
import React, {
    useEffect,
    useState,
    useCallback,
} from "react";
import {SubjectContext, type SubjectContextValue, TOKEN} from "../hooks";


export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                             children,
                                                                         }) => {
    const [subjectData, setSubjectData] =
        useState<ApiResponse<SubjectData> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [params, setParams] = useState<Record<string, string>>({});
    const [reload, setReload] = useState(false);

    const fetchSubjects = useCallback(
        async (signal: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            const query = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                ...params,
            }).toString();

            try {
                const res = await fetch(`/api/admin/subjects/?${query}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    signal,
                });

                const jsonData = await res.json();

                if (!res.ok) {
                    setError(jsonData.error || "Failed to fetch subjects");
                    setSubjectData(null);
                    return;
                }

                setSubjectData(jsonData);
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setError(err.message ?? "Unknown error occurred");
                setSubjectData(null);
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
    };

    return (
        <SubjectContext.Provider value={value}>
            {children}
        </SubjectContext.Provider>
    );
};



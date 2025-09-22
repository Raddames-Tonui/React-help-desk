import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/subjects";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { SubjectData, SubjectPayload } from "@/context/types.ts";
import { DataTable } from "@/components/table/DataTable";
import { useSubjects } from "@/context/hooks";
import Modal from "@/components/Modal";
import SubjectForm from "@/pages/subjects/SubjectForm";
import SubjectActions from "@/pages/subjects/SubjectActions";

export default function SubjectsPage() {
    const searchParams = Route.useSearch();
    const navigate = useNavigate();

    const {
        subjects,
        subjectData,
        isLoading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        setParams,
        refresh,
        deleteSubject,
        updateSubject,
        createSubject,
    } = useSubjects();

    const initialSortFromUrl: SortRule[] = searchParams.sortBy
        ? searchParams.sortBy.split(",").map((s) => {
            const [column, direction = "asc"] = s.trim().split(" ");
            return { column, direction: direction as "asc" | "desc" };
        })
        : [];

    const [sortBy, setSortBy] = useState<SortRule[]>(initialSortFromUrl);

    const initialPage = searchParams.page ? Number(searchParams.age) : 1;
    const initialPageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 10;

    useEffect(() => {
        setPage(initialPage);
        setPageSize(initialPageSize);

        const backendParams: Record<string, string> = {};
        if (searchParams.page) backendParams.page = String(searchParams.page);
        if (searchParams.pageSize) backendParams.pageSize = String(searchParams.pageSize);

        setParams(backendParams);
    }, []);

    const sortedSubjects = useMemo(() => sortData(subjects, sortBy), [subjects, sortBy]);

    const subjectsColumns: ColumnProps<SubjectData>[] = [
        { id: "id", caption: "ID", size: 5, isSortable: true },
        { id: "name", caption: "Name", size: 150, isSortable: true },
        { id: "description", caption: "Description", size: 200 },
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
        },
        {
            id: "created_at",
            caption: "Created",
            size: 120,
            isSortable: true,
            renderCell: (v) => new Date(v as string).toLocaleDateString(),
        },
        {
            id: "actions",
            caption: "Actions",
            size: 200,
            renderCell: (_, row) => (
                <SubjectActions
                    subject={row}
                    updateSubject={updateSubject}
                    deleteSubject={deleteSubject}
                />
            ),
        },
    ];


    const updateUrl = useCallback(() => {
        navigate({
            search: {
                page,
                pageSize,
                sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
            }
        })
    }, [navigate, page, pageSize, sortBy]);


    const handleSortApply = (rules: SortRule[]) => {
        setSortBy(rules);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(1);
    }


    const tableActionsRight = (
        <div>
            <label htmlFor="pageSizeSelect"></label>
            <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="button-sec"
                style={{ padding: "0.4rem 1rem " }}
            >
                {[3, 10, 20].map((size) => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
        </div>
    );

    useEffect(() => {
        updateUrl();
    }, [updateUrl]);


    // Modal state for creating subject
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPayload, setNewPayload] = useState<SubjectPayload>({ name: "", description: "" });

    return (
        <div>
            <div className="page-header">
                <h1>Subjects</h1>
                <button className="button-sec" onClick={() => setIsModalOpen(true)}>
                    Create Subject
                </button>
            </div>

            <div className="table-wrapper">
                <DataTable
                    columns={subjectsColumns}
                    data={sortedSubjects}
                    isLoading={isLoading}
                    error={error}
                    onRefresh={refresh}
                    initialSort={sortBy}
                    onSortApply={handleSortApply}
                    pagination={{
                        page: subjectData?.current_page,
                        pageSize: subjectData?.page_size,
                        total: subjectData?.total_count,
                        onPageChange: handlePageChange,
                    }}
                    tableActionsRight={tableActionsRight}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                title="Create Subject"
                body={<SubjectForm onChange={setNewPayload} />}
                footer={
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                        <button
                            className="modal-close-btn"
                            onClick={() => {
                                createSubject(newPayload);
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

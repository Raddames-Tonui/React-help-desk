import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_protected/admin/subjects";
import { sortData } from "@/components/table/utils/tableUtils";
import type { ColumnProps, SortRule } from "@/components/table/DataTable";
import type { SubjectData } from "@/context/types";
import { DataTable } from "@/components/table/DataTable";
import { useSubjects } from "@/pages/subjects/useSubjects";
import Modal from "@/components/Modal";
import SubjectForm from "./SubectForm";

export default function SubjectsPage() {
    const searchParams = Route.useSearch();
    const navigate = useNavigate();

    const initialPage = searchParams.page ? Number(searchParams.page) : 1;
    const initialPageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 10;
    const initialSort: SortRule[] = searchParams.sortBy
        ? searchParams.sortBy.split(",").map((s) => {
            const [column, direction = "asc"] = s.trim().split(" ");
            return { column, direction: direction as "asc" | "desc" };
        })
        : [];

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const { data, isLoading, error, refetch } = useSubjects(page, pageSize);

    useEffect(() => {
        navigate({
            search: {
                page,
                pageSize,
                sortBy: sortBy.map((r) => `${r.column} ${r.direction}`).join(","),
            },
            replace: true,
        });
    }, [page, pageSize, sortBy, navigate]);

    const sortedSubjects = useMemo(
        () => sortData(data?.records ?? [], sortBy),
        [data?.records, sortBy]
    );

    const subjectsColumns: ColumnProps<SubjectData>[] = [
        { id: "id", caption: "ID", size: 5, isSortable: true },
        { id: "name", caption: "Name", size: 150, isSortable: true, isFilterable: true, filterType: "dropdown" },
        { id: "description", caption: "Description", size: 200 },
        {
            id: "is_active",
            caption: "Active",
            size: 100,
            isSortable: true,
            isFilterable: true,
            filterType: "dropdown",
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
    ];



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
                    initialSort={sortBy}
                    onSortApply={setSortBy}
                    enableFilter={false}
                    onRefresh={() => refetch()}
                    pagination={{
                        page,
                        pageSize,
                        total: data?.total_count ?? 0,
                        onPageChange: setPage,
                    }}
                    tableActionsRight={
                        <div>
                            <label htmlFor="pageSizeSelect">Page size: </label>
                            <select
                                id="pageSizeSelect"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="button-sec"
                                style={{ padding: "0.4rem 1rem " }}
                            >
                                {[3, 10, 20].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                title="Create Subject"
                body={<SubjectForm onClose={() => setIsModalOpen(false)} />}
                onClose={() => setIsModalOpen(false)}

            />
        </div>
    );
}

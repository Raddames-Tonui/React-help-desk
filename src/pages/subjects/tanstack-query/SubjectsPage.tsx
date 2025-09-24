// src/pages/admin/SubjectsPage.tsx
import { useState } from "react";
import { useSubjects } from "@/hooks/useSubjects";
import type { SubjectData } from "@/context/types";
import { DataTable, type ColumnProps } from "@/components/table/DataTable";

export default function SubjectsPage() {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const { data, isLoading, isError, error, isFetching } = useSubjects(page, pageSize);

    const columns: ColumnProps<SubjectData>[] = [
        { size: 10, id: "id", caption: "ID" },
        { size: 10, id: "name", caption: "Name" },
        { size: 10, id: "description", caption: "Description" },
        { size: 10, id: "created_by_name", caption: "Created By" },
        { size: 10, id: "created_at", caption: "Created At" },
        { size: 10, id: "updated_at", caption: "Updated At" },
        { size: 10, id: "actions", caption: "Actions" },
    ];

    if (isLoading) return <p>Loading subjects...</p>;
    if (isError) return <p className="text-red-600">Error: {error.message}</p>;

    return (
        <div className="p-6">
            <div className="page-header">
                <h1>Subjects</h1>
            
            </div>
            <DataTable
                columns={columns}
                data={data?.records ?? []}
                page={page}
                pageSize={pageSize}
                total={data?.total_count ?? 0}
                onPageChange={setPage}
            />

            {isFetching && <p className="text-gray-500 text-sm mt-2">Refreshing...</p>}
        </div>
    );
}

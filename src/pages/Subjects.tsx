import React from 'react';
import { DataTable, ColumnProps, SortRule } from "@components/table/DataTable.tsx";
import type { SubjectData } from "@/context/types.ts";
import { useSubjects } from "@/hooks/hooks.tsx";


const Subjects: React.FC = () => {
    const {
        subjectData,
        subjects,
        isLoading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        setParams,
        refresh
    } = useSubjects();

    const subjectColumns: ColumnProps<SubjectData>[] = [
        { id: "id", caption: "ID", size: 10, },
        { id: "name", caption: "Name", size: 80, },
        { id: "description", caption: "Description", size: 80, },
        { id: "created_by", caption: "creator_id", size: 80, hide: true },
        { id: "is_active", caption: "Status", size: 80, },
        { id: "created_at", caption: "Date created", size: 80, hide: true },
        { id: "updated_at", caption: "Date updated", size: 80, hide: true },
        { id: "created_by_name", caption: "Creator", size: 80, },
    ]


    return (
        <div>
            <div className="page-header">
                <h1>Subjects</h1>
            </div>

            <div className="table-wrapper">
                <DataTable
                    columns={subjectColumns}
                    data={subjects}
                    isLoading={isLoading}
                    onRefresh={refresh}
                    error={error}
                    pagination={{
                        page: subjectData?.current_page,
                        pageSize: subjectData?.page_size,
                        total: subjectData?.total_count,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </div>
    );
};

export default Subjects;
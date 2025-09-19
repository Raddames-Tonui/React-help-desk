import React from 'react';
import {DataTable, ColumnProps, SortRule} from "@components/table/DataTable.tsx";
import type {SubjectData} from "@/context/types.ts";
import {useSubjects} from "@/hooks";


const Subjects: React.FC= () => {
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
        {id : "id", caption: "ID", size: 80,},
        {id : "name", caption: "Name", size: 80, },
        {id: "description", caption: "Description", size: 80, },
        {id: "created_by", caption: "creator_id", size: 80, hide: true},
        {id: "is_active", caption: "Status", size: 80, },
        {id: "created_at", caption: "Date created", size: 80, },
        {id: "updated_at", caption: "Date updated", size: 80, },
        {id: "created_by_name", caption: "Creator", size: 80, },
    ]


    return (
    <div>
        <DataTable
            columns={subjectColumns}
            data={subjects}
            isLoading={isLoading}
            onRefresh={refresh}

        />
    </div>
  );
};

export default Subjects;
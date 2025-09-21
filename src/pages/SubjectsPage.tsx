import React from "react";
import { DataTable, type ColumnProps } from "@components/table/DataTable.tsx";
import type { SubjectData } from "@/context/types.ts";
import { useSubjects } from "@/hooks/hooks.tsx";
import SubjectActions from "@/components/SubjectActions";

const SubjectsPage: React.FC = () => {
  const {
    subjectData,
    subjects,
    isLoading,
    error,
    setPage,
    setPageSize,
    updateSubject,
    refresh,
    deleteSubject,
  } = useSubjects();

  const subjectColumns: ColumnProps<SubjectData>[] = [
    { id: "id", caption: "ID", size: 10 },
    { id: "name", caption: "Name", size: 80 },
    { id: "description", caption: "Description", size: 80 },
    { id: "created_by", caption: "Creator ID", size: 80, hide: true },
    {
      id: "is_active",
      caption: "Status",
      size: 80,
      renderCell: (_, row) => (row.is_active ? "Active" : "Inactive"),
    },
    { id: "created_at", caption: "Date created", size: 80, hide: true },
    { id: "updated_at", caption: "Date updated", size: 80, hide: true },
    { id: "created_by_name", caption: "Creator", size: 80 },
    {
      id: "actions",
      caption: "Actions",
      size: 80,
      isSortable: false,
      isFilterable: false,
      renderCell: (_, row) => (
        <SubjectActions
          subjects={row}
          updateSubject={updateSubject}
          deleteSubject={deleteSubject}
        />
      ),
    },
  ];

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
            page: subjectData?.current_page ?? 1,
            pageSize: subjectData?.page_size ?? 10,
            total: subjectData?.total_count ?? 0,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default SubjectsPage;

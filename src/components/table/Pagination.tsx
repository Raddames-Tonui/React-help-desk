import React from "react";
import { useDataTable } from "./DataTable";


export function Pagination<T>() {
    const { data } = useDataTable<T>();
    const pagination = (useDataTable<T>() as any).pagination;

    if (!pagination) return null;

    const { page, pageSize, total, onPageChange } = pagination;

    const totalPages = Math.ceil(total / pageSize);

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    }

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1)
    }

    return (
        <>
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className="table-pagination-btn"
            >
                Prev
            </button>
            <span
                className="table-pagination-info"
            >
                Page {page} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="table-pagination-btn"
            >
                Next
            </button>
        </>
    )
}
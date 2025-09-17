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
            <div>
                <td colSpan={100}
                    className="pagination-cell"
                >
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span
                        className="pagination-info"
                    >
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>

                </td>
            </div>
    )
}
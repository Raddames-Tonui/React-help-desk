import React, { useState } from "react";
import { useDataTable } from "./DataTable";
import ModalSort from "./modals/ModalSort";
import ModalFilter from "./modals/ModalFilter";

export function TableActions<T>() {
    const { tableActionsLeft, tableActionsRight, onSortApply, onFilterApply, onRefresh, sortBy, filter } = useDataTable<T>();
    const [isSortOpen, setSortOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);

    // Handle sort apply
    const handleSortApply = (rules: any[]) => {
        onSortApply?.(rules);
        setSortOpen(false);
    };

    // Handle filter apply
    const handleFilterApply = (rules: any[]) => {
        onFilterApply?.(rules);
        setFilterOpen(false);
    };

    // Reset handlers
    const handleSortReset = () => onSortApply?.([]);
    const handleFilterReset = () => onFilterApply?.([]);

    return (
        <div className="table-actions">
            <div className="table-actions-left">
                {tableActionsLeft}
            </div>
            <div className="table-action-default">
                {/* Filter button */}
                <button
                    onClick={() => setFilterOpen(true)}
                    className={`action-btn ${filter.length > 0 ? "active" : ""}`}
                    style={{ color: filter.length > 0 ? "red" : undefined }}
                >
                    {filter.length > 0 ? `Filter (${filter.length})` : "Filter"}
                    {filter.length > 0 && (
                        <span className="clear-action" onClick={handleFilterReset}>X</span>
                    )}
                </button>

                {/* Sort button */}
                <button
                    onClick={() => setSortOpen(true)}
                    className={`action-btn ${sortBy.length > 0 ? "active" : ""}`}
                    style={{ color: sortBy.length > 0 ? "red" : undefined }}
                >
                    {sortBy.length > 0 ? `Sort (${sortBy.length})` : "Sort"}
                    {sortBy.length > 0 && (
                        <span className="clear-action" onClick={handleSortReset}>X</span>
                    )}
                </button>

                {/* Refresh */}
                <button
                    onClick={() => onRefresh?.()}
                    className="action-btn"
                >
                    Refresh
                </button>
            </div>
            <div className="table-actions-right">
                {tableActionsRight}
            </div>

            {/* Modals */}
            <ModalSort
                isOpen={isSortOpen}
                onClose={() => setSortOpen(false)}
            />
            <ModalFilter
                isOpen={isFilterOpen}
                onClose={() => setFilterOpen(false)}
            />
        </div>
    );
}

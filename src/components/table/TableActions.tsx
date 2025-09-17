import React, { useState, useEffect } from "react";
import { useDataTable } from "./DataTable";
import ModalSort from "./modals/ModalSort";
import ModalFilter from "./modals/ModalFilter";

export function TableActions<T>() {
    const { tableActionsLeft, tableActionsRight, onSortApply, onFilterApply, refresh } = useDataTable<T>();
    const [isSortOpen, setSortOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [activeSort, setActiveSort] = useState<string | null>(null);  // Track active sort
    const [activeFilter, setActiveFilter] = useState<string | null>(null);  // Track active filter

    // Reset sort or filter when cleared
    const handleSortReset = () => {
        setActiveSort(null);
        onSortApply?.("");
    };

    const handleFilterReset = () => {
        setActiveFilter(null);
        onFilterApply?.("");
    };

    // Handle sort apply
    const handleSortApply = (sortString: string) => {
        setActiveSort(sortString);  // Update active sort state
        onSortApply?.(sortString);
        setSortOpen(false);
    };

    // Handle filter apply
    const handleFilterApply = (filterString: string) => {
        setActiveFilter(filterString);  // Update active filter state
        onFilterApply?.(filterString);
        setFilterOpen(false);
    };

    return (
        <div className="table-actions">
            <div className="table-actions-left">
                {tableActionsLeft}
            </div>
            <div>
                {/* Filter button */}
                <button
                    onClick={() => setFilterOpen(true)}
                    className={`action-btn ${activeFilter ? "active" : ""}`}
                >
                    {activeFilter ? `${activeFilter} Filter` : "Filter"}
                    {activeFilter && (
                        <span className="clear-action" onClick={handleFilterReset}>X</span>
                    )}
                </button>
                {/* Sort button */}
                <button
                    onClick={() => setSortOpen(true)}
                    className={`action-btn ${activeSort ? "active" : ""}`}
                >
                    {activeSort ? `${activeSort} Sort` : "Sort"}
                    {activeSort && (
                        <span className="clear-action" onClick={handleSortReset}>X</span>
                    )}
                </button>
                <button
                    onClick={() => refresh?.()}
                    className="action-btn"
                >
                    Refresh
                </button>
            </div>
            <div>
                {tableActionsRight}
            </div>

            <ModalSort
                isOpen={isSortOpen}
                onClose={() => setSortOpen(false)}
                onApply={handleSortApply}
            />    
            <ModalFilter 
                isOpen={isFilterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={handleFilterApply}
            />
        </div>
    );
}

import { useState } from "react";
import { useDataTable } from "./DataTable";
import ModalSort from "./modals/ModalSort";
import ModalFilter from "./modals/ModalFilter";

export function TableActions<T>() {
    const { tableActionsLeft, tableActionsRight, onSortApply, onFilterApply, onRefresh, sortBy, filter, enableSort, enableFilter } = useDataTable<T>();
    const [isSortOpen, setSortOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);

    // Reset handlers
    const handleSortReset = () => onSortApply?.([]);
    const handleFilterReset = () => onFilterApply?.([]);

    return (
        <div className="table-actions">
            <div className="table-actions-left">
                {tableActionsLeft}
            </div>

            <div className="table-action-default">
                {/* Filter */}
                {enableFilter &&
                    (filter.length > 0 ? (
                        <div className="open-action active">
                            <span
                                className="chip-label"
                                onClick={() => setFilterOpen(true)}
                            >
                                {filter.length} Filter
                            </span>
                            <button
                                className="clear-action"
                                onClick={handleFilterReset}
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="action-btn"
                        >
                            Filter
                        </button>
                    ))}

                {/* Sort */}
                {enableSort &&
                    (sortBy.length > 0 ? (
                        <div className="open-action active">
                            <span
                                className="chip-label"
                                onClick={() => setSortOpen(true)}
                            >
                                {sortBy.length} Sort
                            </span>
                            <button
                                className="clear-action"
                                onClick={handleSortReset}
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSortOpen(true)}
                            className="action-btn"
                        >
                            Sort
                        </button>
                    ))}

                {/* Refresh */}
                <button onClick={() => onRefresh?.()} className="action-btn">
                    Refresh
                </button>
            </div>

            <div className="table-actions-right">
                {tableActionsRight}
            </div>

            {/* Modals */}
            <ModalSort isOpen={isSortOpen} onClose={() => setSortOpen(false)} />
            <ModalFilter isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} />
        </div>
    );
}

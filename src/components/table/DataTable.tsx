import React, { createContext, useContext, useState } from "react";
import "./css/DataTable.css";
import { TableActions } from "./TableActions";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import TableFooter from "./TableFooter";
import { Pagination } from "./Pagination";

/**
 * Column config for Datatable
 */
export interface ColumnProps<T, K extends keyof T = keyof T> {
    id: K;
    caption: string;
    size: number;
    align?: "left" | "center" | "right";
    hide?: boolean;
    isSortable?: boolean;
    isFilterable?: boolean;
    data_type?: string | boolean | number | Date;
    renderCell?: (value: T[K], row: T) => React.ReactNode; // cell-level custom render
    renderColumn?: (column: ColumnProps<T>) => React.ReactNode; // column-level custom render
}

/**
 * Row-level custom rendering
 */
export interface RowRenderProps<T> {
    (row: T, rowIndex: number): {
        className?: string;
        style?: React.CSSProperties;
        render?: React.ReactNode;   // full row replacement
        [key: string]: any;         // extra props for <tr>
    };
}

/**
Works well with React props spreading: <tr {...getProps(row)} className={className} style={style}></tr>
Type-safe for unforeseen props (limited to valid row HTML attributes).

export interface RowRender<T> {
  className?: (row: T, rowIndex: number) => string;
  style?: (row: T, rowIndex: number) => React.CSSProperties;
  render?: (row: T, rowIndex: number) => React.ReactNode;
  getProps?: (row: T, rowIndex: number) => React.HTMLAttributes<HTMLTableRowElement>;
}
*/

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}

/**
 * Props accepted by the DataTable component
 */
export interface DataTableProps<T> {
    columns: ColumnProps<T>[];
    data: T[];
    tableActionsLeft?: React.ReactNode;   // Custom buttons left and right
    tableActionsRight?: React.ReactNode;
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode; // Row-level custom render
    pagination?: PaginationProps;

    // Sort/Filter/Search (initial + handlers)
    initialSort?: string;
    initialFilter?: string;
    initialSearch?: string;
    onSortApply?: (sortString: string) => void;
    onFilterApply?: (filterString: string) => void;
    onSearchApply?: (searchString: string) => void;
    onRefresh?: () => void;
}

/** ---- Context for table state ----
    This makes DataTable subcomponents reusable without prop-drilling.
    Instead of passing `sortBy`, `filter`, etc. into *every* child (TableActions, ModalSort, ModalFilter),
    we just provide them here once, and children read/update with `useDataTable`.
 */
interface DataTableContextType<T> {
    columns: ColumnProps<T>[];
    data: T[];
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
    pagination?: PaginationProps;
    tableActionsLeft?: React.ReactNode;
    tableActionsRight?: React.ReactNode;

    // State for Actions
    sortBy: string;
    filter: string;
    search: string;
    onSortApply?: (sortString: string) => void;
    onFilterApply?: (filterString: string) => void;
    onSearchApply?: (searchString: string) => void;
    onRefresh?: () => void;
}

/**
 * Create context with a *generic type* but default to `any`.
 * Later, we will cast back to the right generic in `useDataTable`.
 */
const DataTableContext = createContext<DataTableContextType<any> | undefined>(undefined);

/**
 * Hook for consuming DataTable context
 * Cast back to the caller's generic type <T>
 */
export const useDataTable = <T,>() => {
    const context = useContext(DataTableContext) as DataTableContextType<T>;
    if (!context) throw new Error("useDataTable must be used within a DataTableProvider");
    return context;
};

/**
 * DataTable Component
 * Reusable wrapper that provides:
 * - context to children (columns, data, pagination, actions, sort/filter/search state)
 * - table layout (header, body, footer, pagination, actions)
 */
export function DataTable<T>({
    columns,
    data,
    tableActionsLeft,
    tableActionsRight,
    rowRender,
    pagination,
    initialSort = "",
    initialFilter = "",
    initialSearch = "",
    onSortApply,
    onFilterApply,
    onSearchApply,
    onRefresh,
}: DataTableProps<T>) {
    // Local state for search/sort/filter
    // This makes DataTable self-contained; children always read the *current* state
    const [sortBy, setSortBy] = useState(initialSort);
    const [filter, setFilter] = useState(initialFilter);
    const [search, setSearch] = useState(initialSearch);

    return (
        <DataTableContext.Provider
            value={{
                columns,
                data,
                rowRender,
                pagination,
                tableActionsLeft,
                tableActionsRight,
                sortBy,
                filter,
                search,
                onSortApply: (s) => { setSortBy(s); onSortApply?.(s); },
                onFilterApply: (f) => { setFilter(f); onFilterApply?.(f); },
                onSearchApply: (q) => { setSearch(q); onSearchApply?.(q); },
                onRefresh,
            }}
        >
            <div className="table-wrapper">
                {/* Top toolbar (search, filter, sort, custom buttons) */}
                <div className="table-action-wrapper">
                    <TableActions />
                </div>

                <table className="table">
                    <thead>
                        <TableHeader />
                    </thead>
                    <tbody>
                        <TableBody />
                    </tbody>
                    <tfoot className="table-footer">
                        <TableFooter />
                    </tfoot>
                </table>

                <div className="table-pagination">
                    <Pagination />
                </div>
            </div>
        </DataTableContext.Provider>
    );
}

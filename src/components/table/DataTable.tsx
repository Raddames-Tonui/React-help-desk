import React, { createContext, useContext, useState } from "react";
import "./css/DataTable.css";
import { TableActions } from "./TableActions";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import TableFooter from "./TableFooter";
import { Pagination } from "./Pagination";
import Loader from "../Loader";

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
    renderCell?: (value: T[K], row: T) => React.ReactNode; // Cell-level custom render (strongly typed with T[K])
    renderColumn?: (column: ColumnProps<any, any>) => React.ReactNode;     // Column-level custom render
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

/** ---- Sort & Filter Rules ---- */
export interface SortRule {
    column: string;
    direction: "asc" | "desc";
}

export interface FilterRule {
    column: string;
    operator: string;
    value: string;
}

interface PaginationProps {
    page: number | undefined;
    pageSize: number | undefined;
    total: number | undefined;
    onPageChange: (page: number) => void;
}

/**
 * Props accepted by the DataTable component
 */
export interface DataTableProps<T> {
    columns: ColumnProps<T, any>[];
    data: T[];
    tableActionsLeft?: React.ReactNode;   // Custom buttons left and right
    tableActionsRight?: React.ReactNode;
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode; // Row-level custom render
    pagination?: PaginationProps;

    // Sort/Filter/Search (initial + handlers)
    initialSort?: SortRule[];
    initialFilter?: FilterRule[];
    initialSearch?: string[];
    onSortApply?: (sortRules: SortRule[]) => void;
    onFilterApply?: (filterRules: FilterRule[]) => void;
    onSearchApply?: (searchArr: string[]) => void;
    onRefresh?: () => void;

    error?: string | null;
    isLoading?: boolean;
}

/** ---- Context for table state ---- */
interface DataTableContextType<T> {
    columns: ColumnProps<T, any>[];
    data: T[];
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
    pagination?: PaginationProps;
    tableActionsLeft?: React.ReactNode;
    tableActionsRight?: React.ReactNode;

    error?: string | null;
    isLoading?: boolean;

    sortBy: SortRule[];
    filter: FilterRule[];
    search: string[];
    onSortApply?: (sortRules: SortRule[]) => void;
    onFilterApply?: (filterRules: FilterRule[]) => void;
    onSearchApply?: (searchArr: string[]) => void;
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
    initialSort = [],
    initialFilter = [],
    initialSearch = [],
    onSortApply,
    onFilterApply,
    onSearchApply,
    onRefresh,
    error,
    isLoading,
}: DataTableProps<T>) {
    const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
    const [filter, setFilter] = useState<FilterRule[]>(initialFilter);
    const [search, setSearch] = useState<string[]>(initialSearch);

    const value: DataTableContextType<any> = {
        columns,
        data,
        rowRender,
        pagination,
        tableActionsLeft,
        tableActionsRight,
        sortBy,
        filter,
        search,
        onSortApply: (rules: SortRule[]) => { setSortBy(rules); onSortApply?.(rules); },
        onFilterApply: (rules: FilterRule[]) => { setFilter(rules); onFilterApply?.(rules); },
        onSearchApply: (arr: string[]) => { setSearch(arr); onSearchApply?.(arr); },
        onRefresh,
        error,
        isLoading,
    };

    return (
        <DataTableContext.Provider value={value}>
            <div className="table-wrapper">
                {error ? (
                    <div className="table-error">{error}</div>
                ) : isLoading ? (
                    <div className="table-loader">
                        <Loader />
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </DataTableContext.Provider>
    );
}
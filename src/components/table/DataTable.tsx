// DataTable.tsx
import React, { createContext, useContext, useState } from "react";
import "./css/DataTable.css";
import { TableActions } from "./TableActions";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import TableFooter from "./TableFooter";
import { Pagination } from "./Pagination";
import Loader from "./modals/Loader";


// Column config for Datatable
export interface ColumnProps<T, K extends keyof T = keyof T> {
  id: K;
  caption: string;
  size: number;
  align?: "left" | "center" | "right";
  hide?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  filterType?: "text" | "dropdown";
  filterOptions?: { value: string; label: string }[];

  data_type?: string | boolean | number | Date;
  renderCell?: (value: T[K], row: T) => React.ReactNode;
  renderColumn?: (column: ColumnProps<any, any>) => React.ReactNode;
}

export interface RowRenderProps<T> {
  (row: T, rowIndex: number): {
    className?: string;
    style?: React.CSSProperties;
    render?: React.ReactNode;
    [key: string]: any;
  };
}

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
  tableActionsLeft?: React.ReactNode;
  tableActionsRight?: React.ReactNode;
  rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
  pagination?: PaginationProps;

  initialSort?: SortRule[];
  initialFilter?: FilterRule[];
  initialSearch?: string[];
  onSortApply?: (sortRules: SortRule[]) => void;
  onFilterApply?: (filterRules: FilterRule[]) => void;
  onSearchApply?: (searchArr: string[]) => void;
  onRefresh?: () => void;

  error?: string | null | Error;
  isLoading?: boolean;

  enableSort?: boolean;
  enableFilter?: boolean;
}

/** ---- Context ---- */
interface DataTableContextType<T> {
  columns: ColumnProps<T, any>[];
  data: T[];
  rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
  pagination?: PaginationProps;
  tableActionsLeft?: React.ReactNode;
  tableActionsRight?: React.ReactNode;
  error?: string | null | Error;
  isLoading?: boolean;

  sortBy: SortRule[];
  filter: FilterRule[];
  search: string[];
  onSortApply?: (sortRules: SortRule[]) => void;
  onFilterApply?: (filterRules: FilterRule[]) => void;
  onSearchApply?: (searchArr: string[]) => void;
  onRefresh?: () => void;

  enableSort?: boolean;
  enableFilter?: boolean;
}

const DataTableContext = createContext<DataTableContextType<any> | undefined>(
  undefined
);



// DataTable Component 
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
  enableSort = true,
  enableFilter = true,
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
    onSortApply: (rules: SortRule[]) => {
      setSortBy(rules);
      onSortApply?.(rules);
    },
    onFilterApply: (rules: FilterRule[]) => {
      setFilter(rules);
      onFilterApply?.(rules);
    },
    onSearchApply: (arr: string[]) => {
      setSearch(arr);
      onSearchApply?.(arr);
    },
    onRefresh,
    error,
    isLoading,
    enableSort,
    enableFilter,
  };

  return (
    <DataTableContext.Provider value={value}>
      <div className="table-wrapper">
        {error ? (
          <div className="table-error">{error.toString()}</div>
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


export const useDataTable = <T,>() => {
  const context = useContext(DataTableContext) as DataTableContextType<T>;
  if (!context) throw new Error("useDataTable must be used within a DataTableProvider");
  return context;
};
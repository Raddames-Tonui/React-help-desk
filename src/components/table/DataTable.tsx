import React, { createContext, useContext } from "react";
import "./DataTable.css"

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

export interface RowRenderProps<T> {
    (row: T, rowIndex: number): {
        className?: string;
        style?: React.CSSProperties;
        render?: React.ReactNode;   // full row replacement
        [key: string]: any;         // extra props for <tr>
    }
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

export interface DataTableProps<T> {
    columns: ColumnProps<T>[];
    data: T[];
    tableActionsLeft?: React.ReactNode;
    tableActionsRight?: React.ReactNode;
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode; // Row-level custom render
    pagination?: PaginationProps;
}

// ---- Context for table state ----
interface DataTableContextType<T> {
    columns: ColumnProps<T>[];
    data: T[];
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
}

const DataTableContext = createContext<DataTableContextType<any> | undefined>(undefined);

export const useDataTable = <T,>() => {
    const context = useContext<DataTableContextType<T> | undefined>(DataTableContext);
    if (!context) throw new Error("useDataTable must be used within a DataTableProvider");
    return context;
};

export function DataTable<T>({ columns, data, tableActionsLeft, tableActionsRight, rowRender, pagination }: DataTableProps<T>) {
    return (
        <DataTableContext.Provider value={{ columns, data, rowRender }}>
            <div className="data-table w-full overflow-auto">
                {/** Table Actions **/}
                {(tableActionsLeft || tableActionsRight) && (
                    <div className="flex justify-between mb-2">
                        <div>{tableActionsLeft}</div>
                        <div>{tableActionsRight}</div>
                    </div>
                )}
                {/** Table placeholder, will build TableHeader, TableBody, TableFooter next **/}
                <table className="w-full border-collapse">
                    <thead>{/* TableHeader will go here */}</thead>
                    <tbody>{/* TableBody will go here */}</tbody>
                    <tfoot>{/* TableFooter will go here */}</tfoot>
                </table>
            </div>
        </DataTableContext.Provider>
    );
}

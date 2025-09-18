import React from "react";
import { useDataTable } from "./DataTable";
import type { ColumnProps } from "./DataTable";

export function TableHeader<T>() {
    const { columns } = useDataTable<T>();

    return (
        <tr className="table-header">
            {columns.map((col: ColumnProps<T>) => {
                if (col.hide) return null; 

                return (
                    <th
                        key={String(col.id)}
                        className={`align-${col.align || "left"}`}
                        style={{width: `${col.size}px`}}
                    >
                        {col.renderColumn? col.renderColumn(col) : col.caption}
                    </th>
                )
            })}
        </tr>
    )
}
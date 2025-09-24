import { useState } from "react";
import { useDataTable } from "./DataTable";
import type { ColumnProps } from "./DataTable";


interface RowProps<T> {
    row: T;
    rowIndex: number;
    subRows?: T[]; // Expandable subrows
}

export function TableBody<T>() {
    const { data } = useDataTable<T>();

    return (
        <>
            {data.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} rowIndex={rowIndex} />
            ))}
        </>
    )
}

function Row<T>({ row, rowIndex, subRows }: RowProps<T>) {
    const { columns, rowRender } = useDataTable<T>();
    const [expanded, setExpanded] = useState(false);

const defaultCells = columns.map((col: ColumnProps<T>) => {
    const value = row[col.id] as any;

    return (
        <td
            key={String(col.id)}
            className={`align-${col.align || "left"}`}
            style={col.hide ? { display: "none" } : undefined}
        >
            {col.renderCell ? col.renderCell(value, row) : String(value ?? "")}
        </td>
    );
});



    const rowContent = rowRender ? rowRender(row, defaultCells) : defaultCells;

    return (
        <>
            <tr
                className="table-row"
                onClick={() => subRows && setExpanded(!expanded)}
            >
                {rowContent}
            </tr>
            {expanded && subRows && subRows.map((subRow, subIndex) => (
                <tr key={`${rowIndex}-sub-${subIndex}`} className="sub-row">
                    {columns.map((col: ColumnProps<T>) => {
                        if (col.hide) return null;
                        const value = subRow[col.id];
                        return (
                            <td key={String(col.id)} className={`align-${col.align || "left"}`}>
                                {col.renderCell ? col.renderCell(value, subRow) : String(value ?? "")}
                            </td>
                        );
                    })}
                </tr>
            ))}
        </>
    )
}
import React from "react";
import "../css/Table.css";

export interface ColumnProps<T, K extends keyof T = keyof T> {
  id: K; 
  caption: string;
  size: number;
  align?: "left" | "right" | "center";
  hide?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
  data_type?: string | boolean | number | Date;
  render?: (row: T, value: T[K]) => React.ReactNode; 
}

interface TableProps<T> {
  columns: ColumnProps<T, keyof T>[];
  data: T[];
}

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(
            (col) =>
              !col.hide && (
                <th
                  key={String(col.id)}            
                >
                  {col.caption}
                </th>
              )
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) =>
              !col.hide ? (
                <td
                  key={String(col.id)}
                  style={{
                    textAlign: col.align,
                    width: col.size,
                    padding: "8px",
                  }}
                >
                  {col.render
                    ? col.render(row, row[col.id])
                    : String(row[col.id])}
                </td>
              ) : null
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

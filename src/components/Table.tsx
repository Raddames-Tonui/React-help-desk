import React from "react";
import "../css/Table.css";

export interface ColumnProps<T> {
  id: keyof T;
  caption: string;
  size?: number;
  align?: "left" | "right" | "center";
  hide?: boolean;
  isSortabe?: boolean,
  isFilterable?:boolean,
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: ColumnProps<T>[];
  data: T[];
}

const Table = <T extends { [key: string]: any }>({ columns, data }: TableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(
            (col) =>
              !col.hide && (
                <th
                  key={String(col.id)}
                  style={{
                    textAlign: col.align ?? "left",
                    width: col.size ?? 100,
                    padding: "8px",
                  }}
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
            {columns.map(
              (col) =>
                !col.hide && (
                  <td
                    key={String(col.id)}
                    style={{
                      textAlign: col.align ?? "left",
                      width: col.size ?? 100,
                      padding: "8px",
                    }}
                  >
                    {col.render ? col.render(row) : String(row[col.id])}
                  </td>
                )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

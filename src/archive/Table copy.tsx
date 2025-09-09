import React from "react";
import "../css/Table.css";

// ---------- Types

type Align = "left" | "center" | "right";
type SortDir = "asc" | "desc";

// An accessor can be a property name of T or a function deriving a value
export type Accessor<T extends Record<string, unknown>> =
  | keyof T
  | ((row: T) => unknown);

export interface ColumnDef<T extends Record<string, unknown>> {
  /** Unique id for this column; if omitted we derive it from accessor or index */
  id?: string;
  /** Header caption; if omitted we prettify the accessor (ticket_id -> Ticket Id) */
  header?: string;
  /** How to get the cell value from a row */
  accessor: Accessor<T>;
  /** Optional visual settings */
  width?: number | string; // 120, "20%", etc
  align?: Align;
  hide?: boolean;
  /** Behavior */
  sortable?: boolean;
  filterable?: boolean; // (placeholder for later)
  /** Hint for sorting or formatting */
  dataType?: "text" | "number" | "date" | "boolean" | "custom";
  /** Optional custom cell renderer */
  render?: (args: { row: T; value: unknown; rowIndex: number; colIndex: number }) => React.ReactNode;
  /** Optional extra class */
  className?: string;
}

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  /** If your rows have a natural id, provide it; otherwise we fall back to index */
  rowKey?: (row: T, index: number) => React.Key;
  emptyMessage?: string;
  className?: string;
}

// ---------- Helpers

function titleize(key: string): string {
  return key
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function getValue<T extends Record<string, unknown>>(row: T, accessor: Accessor<T>) {
  return typeof accessor === "function" ? accessor(row) : row[accessor];
}

// put a collator outside the function so it isn't recreated every comparison
const defaultCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compareValues(
  a: unknown,
  b: unknown,
  dataType: "number" | "boolean" | "date" | "text" | "custom" = "text"
): number {
  // 1. Null/undefined handling (decide whether nulls go first or last)
  const aIsNil = a === null || a === undefined;
  const bIsNil = b === null || b === undefined;
  if (aIsNil && bIsNil) return 0;
  if (aIsNil) return -1; // nulls come first; use 1 to put them last
  if (bIsNil) return 1;

  // 2. Numbers
  if (dataType === "number") {
    const na = Number(a);
    const nb = Number(b);
    const aNaN = Number.isNaN(na);
    const bNaN = Number.isNaN(nb);
    if (aNaN && bNaN) return 0;
    if (aNaN) return -1; // treat invalid numbers as smaller (or flip)
    if (bNaN) return 1;
    // safe numeric difference
    return na - nb;
  }

  // 3. Booleans — normalize common forms
  if (dataType === "boolean") {
    const toBool = (v: unknown) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "true") return true;
        if (s === "false") return false;
      }
      // fallback to JS truthiness
      return Boolean(v);
    };
    const ba = toBool(a);
    const bb = toBool(b);
    if (ba === bb) return 0;
    return ba ? 1 : -1;
  }

  // 4. Dates
  if (dataType === "date") {
    const ta = Date.parse(String(a));
    const tb = Date.parse(String(b));
    const aNaN = Number.isNaN(ta);
    const bNaN = Number.isNaN(tb);
    if (aNaN && bNaN) return 0;
    if (aNaN) return -1;
    if (bNaN) return 1;
    return ta - tb;
  }

  // 5. Default: strings using collator
  const sa = String(a);
  const sb = String(b);
  return defaultCollator.compare(sa, sb);
}


// ---------- Component

function TableInner<T extends Record<string, unknown>>(props: TableProps<T>) {
  const {
    data,
    columns,
    rowKey = (_row, i) => i,
    emptyMessage = "No data",
    className = "",
  } = props;

  const [sort, setSort] = React.useState<{ colIndex: number; dir: SortDir } | null>(null);

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => !c.hide),
    [columns]
  );

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const col = visibleColumns[sort.colIndex];
    if (!col || col.sortable === false) return data;

    const dt = col.dataType ?? "text";
    return [...data].sort((ra, rb) => {
      const av = getValue(ra, col.accessor);
      const bv = getValue(rb, col.accessor);
      const cmp = compareValues(av, bv, dt);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [data, sort, visibleColumns]);

  function toggleSort(colIndex: number) {
    const col = visibleColumns[colIndex];
    if (!col || col.sortable === false) return;

    setSort((prev) => {
      if (!prev || prev.colIndex !== colIndex) return { colIndex, dir: "asc" };
      return { colIndex, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <table className={`data-table ${className}`}>
      <thead>
        <tr>
          {visibleColumns.map((col, i) => {
            const idFromAccessor =
              typeof col.accessor === "string" ? (col.accessor as string) : undefined;

            const colId = col.id ?? idFromAccessor ?? `col-${i}`;
            const header =
              col.header ??
              (idFromAccessor ? titleize(idFromAccessor) : colId);

            const sortable = col.sortable !== false;
            const isSorted = sort?.colIndex === i;
            const sortClass = isSorted ? (sort?.dir === "asc" ? "sort-asc" : "sort-desc") : "";

            return (
              <th
                key={colId}
                className={`${col.className ?? ""} ${sortable ? "sortable" : ""} ${sortClass}`}
                style={{ textAlign: col.align ?? "left", width: col.width }}
                onClick={() => toggleSort(i)}
                aria-sort={isSorted ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
              >
                {header}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {sortedData.length === 0 ? (
          <tr>
            <td className="empty" colSpan={visibleColumns.length}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          sortedData.map((row, rIdx) => (
            <tr key={rowKey(row, rIdx)}>
              {visibleColumns.map((col, cIdx) => {
                const value = getValue(row, col.accessor);
                return (
                  <td
                    key={(col.id ?? String(cIdx)) + "_cell"}
                    style={{ textAlign: col.align ?? "left", width: col.width }}
                    className={col.className}
                  >
                    {col.render
                      ? col.render({ row, value, rowIndex: rIdx, colIndex: cIdx })
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// Wrap in a generic-friendly component signature
const Table = React.memo(TableInner) as typeof TableInner;
export default Table;

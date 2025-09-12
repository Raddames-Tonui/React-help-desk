import { ColumnProps } from "../components/Table";

export function buildFilterOptions<T>(columns: ColumnProps<T>[]) {
  return columns
    .filter((col) => col.isFilterable)
    .map((col) => ({
      id: String(col.id),
      caption: col.caption,
    }));
}

export function buildSortOptions<T>(columns: ColumnProps<T>[]) {
  return columns
    .filter((col) => col.isSortable)
    .map((col) => ({
      id: String(col.id),
      caption: col.caption,
    }));
}

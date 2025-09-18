import React from "react";
import Modal from "./Modal";
import { useDataTable } from "../DataTable";
import type { ColumnProps } from "../DataTable";
import type { SortRule } from "../DataTable"; // now using the array type

export default function ModalSort<T>({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { columns, sortBy, onSortApply } = useDataTable<T>();
  const [rules, setRules] = React.useState<SortRule[]>([]);

  // Sync modal state with context whenever opened
  React.useEffect(() => {
    if (isOpen) {
      setRules(sortBy);
    }
  }, [isOpen, sortBy]);

  const updateRule = (i: number, field: keyof SortRule, val: string) => {
    const updated = [...rules];
    updated[i][field] = val as "asc" | "desc";
    setRules(updated);
  };

  const addRule = () => setRules([...rules, { column: "", direction: "asc" }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));
  const reset = () => setRules([]);

  const handleSubmit = () => {
    onSortApply?.(rules.filter((r) => r.column));
    onClose();
  };

  const sortableColumns = columns.filter((c: ColumnProps<T>) => c.isSortable);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sort"
      body={
        <div>
          {rules.map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <select
                value={rule.column}
                className="button-sec"
                onChange={(e) => updateRule(i, "column", e.target.value)}
              >
                <option value="">Select Column</option>
                {sortableColumns.map((col) => (
                  <option key={col.id} value={String(col.id)}>
                    {col.caption}
                  </option>
                ))}
              </select>

              <select
                value={rule.direction}
                className="button-sec"
                onChange={(e) => updateRule(i, "direction", e.target.value as "asc" | "desc")}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <button style={{ border: "none", background: "none" }} onClick={() => removeRule(i)}>
                <svg   width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3V4H4V6H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#A10900"/>
                </svg>
              </button>
            </div>
          ))}

          <button className="button-sec" onClick={addRule}>
            ➕ Add Sort
          </button>
        </div>
      }
      footer={
        <div>
          <button className="cancel" onClick={reset}>
            Reset
          </button>
          <button className="modal-close-btn" onClick={handleSubmit}>
            Apply
          </button>
        </div>
      }
    />
  );
}

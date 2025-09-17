import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Icon from "../../../utilities/Icon";
import { useDataTable } from "../DataTable";
import type { ColumnProps } from "../DataTable";

type SortRule = {
  column: string;
  direction: "asc" | "desc";
};

interface SortModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sortString: string) => void;
  initialSort?: string;
}

export default function ModalSort<T>({
  isOpen,
  onClose,
  onApply,
  initialSort,
}: SortModalProps<T>) {
  const { columns } = useDataTable<T>();
  const [rules, setRules] = useState<SortRule[]>([]);

  // Only parse initialSort when it exists; do not reset otherwise
  useEffect(() => {
    if (isOpen && initialSort) {
      const parsed = initialSort.split(",").map((rule) => {
        const [col, dir = "asc"] = rule.trim().split(" ");
        return { column: col, direction: dir as "asc" | "desc" };
      });
      setRules(parsed);
    }
  }, [isOpen, initialSort]);

  const updateRule = (i: number, field: keyof SortRule, val: string) => {
    const updated = [...rules];
    updated[i][field] = val as "asc" | "desc";
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { column: "", direction: "asc" }]);
  }
  const removeRule = (i: number) => {
    setRules(rules.filter((_, idx) => idx !== i));
  }
  const reset = () => setRules([]); 

  const handleSubmit = () => {
    const sortString = rules
      .filter((r) => r.column)
      .map((r) => `${r.column} ${r.direction}`)
      .join(", ");
    onApply(sortString);
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
            <div
              key={i}
              style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
            >
              <select
                value={rule.column}
                className="button-sec"
                onChange={(e) => updateRule(i, "column", e.target.value)}
              >
                <option value="">Select Column</option>
                {sortableColumns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.caption}
                  </option>
                ))}
              </select>

              <select
                value={rule.direction}
                className="button-sec"
                onChange={(e) =>
                  updateRule(i, "direction", e.target.value as "asc" | "desc")
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <button
                style={{ border: "none", background: "none" }}
                onClick={() => removeRule(i)}
              >
                <Icon iconName="delete" />
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

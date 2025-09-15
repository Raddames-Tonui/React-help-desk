import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { ColumnProps } from "./Table";

type SortRule = {
  column: string;
  direction: "asc" | "desc";
};

interface SortModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProps<T>[];
  onApply: (sortString: string) => void;
  initialSort?: string;
}

export default function Modalsort<T>({
  isOpen,
  onClose,
  columns,
  onApply,
  initialSort,
}: SortModalProps<T>) {
  const [rules, setRules] = useState<SortRule[]>([]);

  // when modal opens, parse initialSort
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
  };

  const removeRule = (i: number) => {
    setRules(rules.filter((_, idx) => idx !== i));
  };

  const reset = () => setRules([]);

  const handleSubmit = () => {
    const sortString = rules
      .filter((r) => r.column)
      .map((r) => `${r.column} ${r.direction}`)
      .join(", ");
    onApply(sortString);
    onClose();
  };

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
              {/* Column select */}
              <select
                value={rule.column}
                className="button-sec"
                onChange={(e) => updateRule(i, "column", e.target.value)}
              >
                <option value="">Select Column</option>
                {columns
                  .filter((c) => c.isSortable)
                  .map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.caption}
                    </option>
                  ))}
              </select>

              {/* Direction */}
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

              <button style={{ border: "none", background: "transparent" }} onClick={() => removeRule(i)}>
                   <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.489201 0.46967C0.782094 0.176777 1.25697 0.176777 1.54986 0.46967L5.01953 3.93934L8.4892 0.46967C8.78209 0.176777 9.25697 0.176777 9.54986 0.46967C9.84275 0.762563 9.84275 1.23744 9.54986 1.53033L6.08019 5L9.54986 8.46967C9.84275 8.76256 9.84275 9.23744 9.54986 9.53033C9.25697 9.82322 8.78209 9.82322 8.4892 9.53033L5.01953 6.06066L1.54986 9.53033C1.25697 9.82322 0.782094 9.82322 0.489201 9.53033C0.196308 9.23744 0.196308 8.76256 0.489201 8.46967L3.95887 5L0.489201 1.53033C0.196308 1.23744 0.196308 0.762563 0.489201 0.46967Z" fill="#C92A2A"/>
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

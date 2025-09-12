import React, { useState } from "react";
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
}

export default function Modalsort<T>({
  isOpen,
  onClose,
  columns,
  onApply,
}: SortModalProps<T>) {
  const [rules, setRules] = useState<SortRule[]>([]);

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
                onChange={(e) =>
                  updateRule(i, "direction", e.target.value as "asc" | "desc")
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <button onClick={() => removeRule(i)}>🗑️</button>
            </div>
          ))}

          <button onClick={addRule}>➕ Add Sort</button>
        </div>
      }
      footer={
        <>
          <button className="cancel"  onClick={reset}>Reset</button>
          <button className="modal-close-btn" onClick={handleSubmit}>Apply</button>
        </>
      }
    />
  );
}

import React, { useState } from "react";
import Modal from "./Modal";
import { ColumnProps } from "./Table";

type FilterRule = {
  column: string;
  relation: string;
  value: string;
};

interface FilterModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProps<T>[];
  onApply: (filterString: string) => void;
}

const relations = [
  { value: "eq", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startswith", label: "Starts With" },
  { value: "endswith", label: "Ends With" },
];

export default function Modalfilter<T>({
  isOpen,
  onClose,
  columns,
  onApply,
}: FilterModalProps<T>) {
  const [rules, setRules] = useState<FilterRule[]>([]);

  const updateRule = (i: number, field: keyof FilterRule, val: string) => {
    const updated = [...rules];
    updated[i][field] = val;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { column: "", relation: "", value: "" }]);
  };

  const removeRule = (i: number) => {
    setRules(rules.filter((_, idx) => idx !== i));
  };

  const reset = () => setRules([]);

  const handleSubmit = () => {
    const filterString = rules
      .filter((r) => r.column && r.relation && r.value)
      .map((r) => {
        switch (r.relation) {
          case "eq":
            return `${r.column} eq '${r.value}'`;
          case "contains":
            return `contains(${r.column},'${r.value}')`;
          case "startswith":
            return `startswith(${r.column},'${r.value}')`;
          case "endswith":
            return `endswith(${r.column},'${r.value}')`;
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" and ");

    onApply(filterString);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
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
                  .filter((c) => c.isFilterable)
                  .map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.caption}
                    </option>
                  ))}
              </select>

              {/* Relation select */}
              <select
                value={rule.relation}
                onChange={(e) => updateRule(i, "relation", e.target.value)}
              >
                <option value="">Relation</option>
                {relations.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Value input */}
              <input
                type="text"
                value={rule.value}
                placeholder="Value"
                onChange={(e) => updateRule(i, "value", e.target.value)}
              />

              <button className="cancel" onClick={() => removeRule(i)}>✖</button>
            </div>
          ))}

          <button onClick={addRule}> Add Filter</button>
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

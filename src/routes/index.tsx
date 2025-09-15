import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { ColumnProps } from "./Table";

export type FilterRule = {
  column: string;
  relation: string;
  value: string;
};

interface FilterModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProps<T>[];
  initialRules?: FilterRule[];
  onApply: (filterString: string) => void;
}

const relations = [
  { value: "eq", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startswith", label: "Starts With" },
  { value: "endswith", label: "Ends With" },
];

// --- Utility: parse OData filter string into rules ---
function parseFilterString(filterString: string): FilterRule[] {
  if (!filterString) return [];

  return filterString.split(" and ").map((clause) => {
    clause = clause.trim();

    if (clause.includes("contains(")) {
      const match = clause.match(/contains\(([^,]+),'([^']+)'\)/);
      return { column: match?.[1] ?? "", relation: "contains", value: match?.[2] ?? "" };
    }
    if (clause.includes("startswith(")) {
      const match = clause.match(/startswith\(([^,]+),'([^']+)'\)/);
      return { column: match?.[1] ?? "", relation: "startswith", value: match?.[2] ?? "" };
    }
    if (clause.includes("endswith(")) {
      const match = clause.match(/endswith\(([^,]+),'([^']+)'\)/);
      return { column: match?.[1] ?? "", relation: "endswith", value: match?.[2] ?? "" };
    }
    if (clause.includes(" eq ")) {
      const match = clause.match(/([^ ]+) eq '([^']+)'/);
      return { column: match?.[1] ?? "", relation: "eq", value: match?.[2] ?? "" };
    }

    return { column: "", relation: "eq", value: "" };
  });
}

export default function ModalFilter<T>({
  isOpen,
  onClose,
  columns,
  initialRules = [],
  onApply,
}: FilterModalProps<T>) {
  const [rules, setRules] = useState<FilterRule[]>([]);

  // Prepopulate from initialRules OR URL filter param
  useEffect(() => {
    if (isOpen) {
      if (initialRules.length) {
        setRules(initialRules);
      } else {
        const params = new URLSearchParams(window.location.search);
        const filterParam = params.get("filter");
        if (filterParam) {
          setRules(parseFilterString(filterParam));
        } else {
          setRules([]);
        }
      }
    }
  }, [isOpen, initialRules]);

  const updateRule = (i: number, field: keyof FilterRule, val: string) => {
    const updated = [...rules];
    updated[i][field] = val;
    setRules(updated);
  };

  const addRule = () =>
    setRules((prev) => [...prev, { column: "", relation: "eq", value: "" }]);

  const removeRule = (i: number) =>
    setRules((prev) => prev.filter((_, idx) => idx !== i));

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

    const params = new URLSearchParams(window.location.search);
    if (filterString) {
      params.set("filter", filterString);
    } else {
      params.delete("filter");
    }
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

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
                className="button-sec"
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
                className="button-sec"
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
                className="button-sec"
                value={rule.value}
                placeholder="Value"
                onChange={(e) => updateRule(i, "value", e.target.value)}
              />

              <button className="cancel" onClick={() => removeRule(i)}>
                ✖
              </button>
            </div>
          ))}

          <button className="button-sec" onClick={addRule}>
            ➕ Add Filter
          </button>
        </div>
      }
      footer={
        <>
          <button className="cancel" onClick={reset}>
            Reset
          </button>
          <button className="modal-close-btn" onClick={handleSubmit}>
            Apply
          </button>
        </>
      }
    />
  );
}

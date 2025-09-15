import React, { useState, useEffect } from "react";
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
  initialRule?: FilterRule;
  onApply: (filterString: string) => void;
}

const relations = [
  { value: "eq", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "startswith", label: "Starts With" },
  { value: "endswith", label: "Ends With" },
];

export default function ModalFilter<T>({
  isOpen,
  onClose,
  columns,
  initialRule,
  onApply,
}: FilterModalProps<T>) {
  const [rule, setRule] = useState<FilterRule>({
    column: "",
    relation: "eq",
    value: "",
  });

  useEffect(() => {
    if (isOpen && initialRule) {
      setRule(initialRule);
    }
  }, [isOpen, initialRule]);

  const updateRule = (field: keyof FilterRule, val: string) => {
    setRule((prev) => ({ ...prev, [field]: val }));
  };

  const reset = () =>
    setRule({ column: "", relation: "eq", value: "" });

  const handleSubmit = () => {
    if (!rule.column || !rule.relation || !rule.value) {
      onApply(""); 
      onClose();
      return;
    }

    let filterString = "";
    switch (rule.relation) {
      case "eq":
        filterString = `${rule.column} eq '${rule.value}'`;
        break;
      case "contains":
        filterString = `contains(${rule.column},'${rule.value}')`;
        break;
      case "startswith":
        filterString = `startswith(${rule.column},'${rule.value}')`;
        break;
      case "endswith":
        filterString = `endswith(${rule.column},'${rule.value}')`;
        break;
    }

    onApply(filterString);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      body={
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <select
            value={rule.column}
            onChange={(e) => updateRule("column", e.target.value)}
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
            onChange={(e) => updateRule("relation", e.target.value)}
          >
            {relations.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={rule.value}
            placeholder="Value"
            onChange={(e) => updateRule("value", e.target.value)}
          />
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

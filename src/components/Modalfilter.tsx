import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { ColumnProps } from "./Table";
import Icon from "../utilities/Icon";

export type FilterRule = {
  column: string;
  operator: string;
  value: string;
};

interface ModalFilterProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProps<T>[];
  initialFilter?: string;
  onApply: (filterString: string) => void;
}

const relations = [
  { value: "eq", label: "Equals" },
  { value: "ne", label: "Not equals" },
  { value: "contains", label: "Contains" },
  { value: "startswith", label: "Starts with" },
  { value: "endswith", label: "Ends with" },
  { value: "gt", label: "Greater than" },
  { value: "lt", label: "Less than" },
  { value: "ge", label: "Greater or equal" },
  { value: "le", label: "Less or equal" },
];

// parse a single condition into a FilterRule (returns null on no match)
function parseCondition(cond: string): FilterRule | null {
  cond = cond.trim();

  // contains(col,'val')
  let m = cond.match(/^contains\(\s*([^,\s)]+)\s*,\s*'((?:[^']|\\')*)'\s*\)$/i);
  if (m) return { column: m[1], operator: "contains", value: m[2] };

  // startswith(col,'val') or endswith(...)
  m = cond.match(/^startswith\(\s*([^,\s)]+)\s*,\s*'((?:[^']|\\')*)'\s*\)$/i);
  if (m) return { column: m[1], operator: "startswith", value: m[2] };

  m = cond.match(/^endswith\(\s*([^,\s)]+)\s*,\s*'((?:[^']|\\')*)'\s*\)$/i);
  if (m) return { column: m[1], operator: "endswith", value: m[2] };

  // comparators: col eq 'val'
  m = cond.match(/^([^ \s]+)\s+(eq|ne|gt|lt|ge|le)\s+'((?:[^']|\\')*)'$/i);
  if (m) return { column: m[1], operator: m[2], value: m[3] };

  return null;
}

// parse whole filter string (handles multiple " and " clauses)
function parseFilterString(filterString?: string): FilterRule[] {
  if (!filterString) return [];

  // decode URL-encoded filter 
  try {
    filterString = decodeURIComponent(filterString);
  } catch {
    // if decode fails, keep original
  }

  // naive split on " and " (works for typical OData usage where values are quoted)
  const parts = filterString.split(/\s+and\s+/i);
  const rules: FilterRule[] = [];

  for (const p of parts) {
    const r = parseCondition(p);
    if (r) rules.push(r);
  }
  return rules;
}

export default function ModalFilter<T>({
  isOpen,
  onClose,
  columns,
  initialFilter,
  onApply,
}: ModalFilterProps<T>) {
  const [rules, setRules] = useState<FilterRule[]>([]);

  // Prepopulate whenmodal opens
  useEffect(() => {
    if (!isOpen) return;
    if (initialFilter) {
      const parsed = parseFilterString(initialFilter);
      setRules(parsed.length ? parsed : []);
    } else {
      setRules([]);
    }
  }, [isOpen, initialFilter]);

  const updateRule = (i: number, field: keyof FilterRule, val: string) => {
    setRules((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  };

  const addRule = () =>
    setRules((prev) => [...prev, { column: "", operator: "contains", value: "" }]);

  const removeRule = (i: number) =>
    setRules((prev) => prev.filter((_, idx) => idx !== i));

  const reset = () => setRules([]);

  const handleSubmit = () => {
    const filterString = rules
      .filter((r) => r.column && r.operator && r.value !== "")
      .map((r) => {
        // choose appropriate formatting
        if (r.operator === "contains" || r.operator === "startswith" || r.operator === "endswith") {
          return `${r.operator}(${r.column},'${r.value}')`;
        }
        return `${r.column} ${r.operator} '${r.value}'`;
      })
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
            <div key={i} style={{ display: "flex",  marginBottom: 10 }}>
              <select
                value={rule.column}
                onChange={(e) => updateRule(i, "column", e.target.value)}
                className="button-sec"
              >
                <option value="">Select Column</option>
                {columns.filter((c) => c.isFilterable).map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.caption}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(e) => updateRule(i, "operator", e.target.value)}
                className="button-sec"
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
                onChange={(e) => updateRule(i, "value", e.target.value)}
                placeholder="Value"
                className="button-sec"
              />

              <button style={{border: "none", background: "none" }} onClick={() => removeRule(i)}>
                  <Icon iconName="delete" />
              </button>
            </div>
          ))}

          <button className="button-sec" onClick={addRule}>
            ➕ Add Filter
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

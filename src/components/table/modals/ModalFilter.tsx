import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Icon from "../../../utilities/Icon"; 
import { useDataTable } from "../DataTable";
import type { ColumnProps } from "../DataTable";

export type FilterRule = {
  column: string;
  operator: string;
  value: string;
};

interface ModalFilterProps<T> {
  isOpen: boolean;
  onClose: () => void;
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

// Parse a single OData condition
function parseCondition(cond: string): FilterRule | null {
  cond = cond.trim();
  cond = cond.replace(/%27/g, "'").replace(/%22/g, '"');

  let m = cond.match(/^(contains|startswith|endswith)\(\s*([^,\s)]+)\s*,\s*['"]([^'"]+)['"]\s*\)$/i);
  if (m) return { column: m[2], operator: m[1], value: m[3] };

  m = cond.match(/^([^ \s]+)\s+(eq|ne|gt|lt|ge|le)\s+['"]([^'"]+)['"]$/i);
  if (m) return { column: m[1], operator: m[2], value: m[3] };

  return null;
}

function parseFilterString(filterString?: string): FilterRule[] {
  if (!filterString) return [];
  let decoded = filterString;
  try {
    decoded = decodeURIComponent(filterString);
  } catch {}
  const parts = decoded.split(/\s+and\s+/i);
  return parts.map((p) => parseCondition(p)).filter((r): r is FilterRule => !!r);
}

export default function ModalFilter<T>({
  isOpen,
  onClose,
  initialFilter,
  onApply,
}: ModalFilterProps<T>) {
  const { columns } = useDataTable<T>();
  const [rules, setRules] = useState<FilterRule[]>([]);

  // Prepopulate from initialFilter only, preserve existing rules otherwise
  useEffect(() => {
    if (!isOpen || !initialFilter) return;
    const parsed = parseFilterString(initialFilter);
    if (parsed.length) setRules(parsed);
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
        if (["contains", "startswith", "endswith"].includes(r.operator)) {
          return `${r.operator}(${r.column},'${r.value}')`;
        }
        return `${r.column} ${r.operator} '${r.value}'`;
      })
      .join(" and ");
    onApply(filterString);
    onClose();
  };

  const filterableColumns = columns.filter((c: ColumnProps<T>) => c.isFilterable);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      body={
        <div>
          {rules.map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: 10 }}>
              <select
                value={rule.column}
                onChange={(e) => updateRule(i, "column", e.target.value)}
                className="button-sec"
              >
                <option value="">Select Column</option>
                {filterableColumns.map((col) => (
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

              <button
                style={{ border: "none", background: "none" }}
                onClick={() => removeRule(i)}
              >
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

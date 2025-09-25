import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { ColumnProps } from "../DataTable";
import Icon from "@/utils/Icon";

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
  // { value: "gt", label: "Greater than" },
  // { value: "lt", label: "Less than" },
  // { value: "ge", label: "Greater or equal" },
  // { value: "le", label: "Less or equal" },
];

/**
 * Parse a single OData condition like:
 *   contains(FirstName,'John')
 *   LastName eq "Doe"
 */
function parseCondition(cond: string): FilterRule | null {
  cond = cond.trim();

  // Normalize URL-encoded quotes back to ' or "
  cond = cond.replace(/%27/g, "'").replace(/%22/g, '"');

  // contains/startswith/endswith
  let m = cond.match(/^(contains|startswith|endswith)\(\s*([^,\s)]+)\s*,\s*['"]([^'"]+)['"]\s*\)$/i);
  if (m) return { column: m[2], operator: m[1], value: m[3] };

  // comparators: col eq 'val'
  m = cond.match(/^([^ \s]+)\s+(eq|ne|gt|lt|ge|le)\s+['"]([^'"]+)['"]$/i);
  if (m) return { column: m[1], operator: m[2], value: m[3] };

  return null;
}

/**
 * Parse a full filter string: "col1 eq 'a' and contains(col2,'b')"
 */
function parseFilterString(filterString?: string): FilterRule[] {
  if (!filterString) return [];

  let decoded = filterString;
  try {
    decoded = decodeURIComponent(filterString);
  } catch {
    // fallback if already decoded
  }

  const parts = decoded.split(/\s+and\s+/i);
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

  // Prepopulate when modal opens
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
            <div key={i} style={{ display: "flex", marginBottom: 10 }}>
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
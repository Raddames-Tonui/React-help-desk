import React from "react";
import Modal from "./Modal";
import Icon from "../../../utilities/Icon";
import { useDataTable } from "../DataTable";
import type { ColumnProps } from "../DataTable";
import type { FilterRule } from "../DataTable";

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

export default function ModalFilter<T>({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { columns, filter, onFilterApply } = useDataTable<T>();
  const [rules, setRules] = React.useState<FilterRule[]>([]);

  // Sync modal state with context whenever opened
  React.useEffect(() => {
    if (isOpen) {
      setRules(filter);
    }
  }, [isOpen, filter]);

  const updateRule = (i: number, field: keyof FilterRule, val: string) => {
    setRules((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: val };
      return copy;
    });
  };

  const addRule = () =>
    setRules((prev) => [...prev, { column: "", operator: "contains", value: "" }]);

  const removeRule = (i: number) => setRules((prev) => prev.filter((_, idx) => idx !== i));
  const reset = () => setRules([]);

  const handleSubmit = () => {
    onFilterApply?.(rules.filter((r) => r.column && r.operator && r.value !== ""));
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
                  <option key={col.id} value={String(col.id)}>
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

              <button style={{ border: "none", background: "none" }} onClick={() => removeRule(i)}>
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

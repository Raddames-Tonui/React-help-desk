import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useDataTable } from "../DataTable";
import type { FilterRule } from "../DataTable";

interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const relations = [
  { value: "eq", label: "Equals" },
  { value: "ne", label: "Not equals" },
  { value: "contains", label: "Contains" },
  { value: "startswith", label: "Starts with" },
  { value: "endswith", label: "Ends with" },
];

function getDropdownOptions<T>(data: T[], columnId: string): string[] {
  const unique = new Set<string>();
  data.forEach((row: any) => {
    const val = row[columnId];
    if (val !== undefined && val !== null) {
      unique.add(String(val));
    }
  });
  return Array.from(unique);
}

export default function ModalFilter<T>({ isOpen, onClose }: ModalFilterProps) {
  const { columns, data, filter, onFilterApply } = useDataTable<T>();
  const [rules, setRules] = useState<FilterRule[]>([]);

  // sync modal state with current filters
  useEffect(() => {
    if (isOpen) {
      setRules(filter ?? []);
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

  const removeRule = (i: number) =>
    setRules((prev) => prev.filter((_, idx) => idx !== i));

  const reset = () => setRules([]);

  const handleSubmit = () => {
    const validRules = rules.filter((r) => r.column && r.operator && r.value !== "");
    onFilterApply?.(validRules);
    onClose();
  };

  const filterableColumns = columns.filter((c) => c.isFilterable);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      body={
        <div>
          {rules.map((rule, i) => {
            const column = filterableColumns.find((c) => c.id === rule.column);

            return (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <select
                  value={rule.column}
                  onChange={(e) => updateRule(i, "column", e.target.value)}
                  className="button-sec"
                >
                  <option value="">Select Column</option>
                  {filterableColumns.map((col) => (
                    <option key={String(col.id)} value={String(col.id)}>
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

                {column?.filterType === "dropdown" ? (
                  <select
                    value={rule.value}
                    onChange={(e) => updateRule(i, "value", e.target.value)}
                    className="button-sec"
                  >
                    <option value="">Select value</option>
                    {getDropdownOptions(data, String(column.id)).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => updateRule(i, "value", e.target.value)}
                    placeholder="Value"
                    className="button-sec"
                  />
                )}

                <button style={{ border: "none", background: "none" }} onClick={() => removeRule(i)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3V4H4V6H5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#A10900" />
                  </svg>
                </button>
              </div>
            );
          })}

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

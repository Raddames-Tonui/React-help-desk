// ------------------ DynamicForm.tsx ------------------
import React, { useState, useCallback } from "react";
import type { DynamicFormProps, FieldNode, LayoutNode, VisibilityRule } from "./utils/types";
import "./css/formstyle.css";

// ---------- DynamicForm Component ----------
export default function DynamicForm<T = Record<string, any>>({
  schema,
  onSubmit,
  initialData,
  className,
  fieldClassName,
  buttonClassName,
}: DynamicFormProps<T>) {
  const { id, meta, fields, layout } = schema;
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------- Initial Values ----------
  const initialValues = Object.fromEntries(
    Object.entries(fields).map(([fid, field]) => {
      const val = initialData?.[fid] ?? field.defaultValue ?? "";
      if (field.renderer === "checkbox" || field.renderer === "switch") return [fid, !!val];
      if (field.renderer === "multiselect") return [fid, Array.isArray(val) ? val : []];
      if (field.renderer === "number") return [fid, typeof val === "number" ? val : ""];
      return [fid, val];
    })
  );

  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  // ---------- Visibility ----------
  const isFieldVisible = useCallback(
    (field: FieldNode): boolean => {
      if (!field.visibleWhen) return true;

      const checkRule = (rule: VisibilityRule) => {
        const target = formValues[rule.field];
        switch (rule.op) {
          case "equals":
            return target === rule.value;
          case "in":
            return Array.isArray(rule.value) && rule.value.includes(target);
          default:
            return true;
        }
      };

      return Array.isArray(field.visibleWhen)
        ? field.visibleWhen.every(checkRule)
        : checkRule(field.visibleWhen);
    },
    [formValues]
  );

  // ---------- Validation ----------
  const validateField = (
    field: FieldNode,
    value: any,
    values: Record<string, any>
  ): string | null => {
    const rules = field.rules;
    if (!rules) return null;

    if (rules.required && (value === undefined || value === "" || value === null))
      return rules.required;
    if (rules.minLength && typeof value === "string" && value.length < rules.minLength.value)
      return rules.minLength.message;
    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength.value)
      return rules.maxLength.message;
    if (rules.pattern && typeof value === "string" && !rules.pattern.value.test(value))
      return rules.pattern.message;
    if (rules.validate) return rules.validate(value, values);
    return null;
  };

  // ---------- Handle Input ----------
  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => {
      const updated = { ...prev, [fieldId]: value };
      Object.values(fields).forEach((f) => {
        if (!isFieldVisible(f)) updated[f.id] = undefined;
      });
      return updated;
    });

    const field = fields[fieldId];
    const err = validateField(field, value, { ...formValues, [fieldId]: value });
    setErrors((prev) => ({ ...prev, [fieldId]: err || "" }));
  };

  // ---------- Handle Submit ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    Object.values(fields).forEach((f) => {
      if (!isFieldVisible(f)) return;
      const val = formValues[f.id];
      const err = validateField(f, val, formValues);
      if (err) validationErrors[f.id] = err;
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit?.(formValues as T);
    }
  };

  // ---------- Handle Reset ----------
  const handleReset = () => {
    setFormValues(initialValues);
    setErrors({});
  };

  // ---------- Render Field ----------
  const renderField = (field: FieldNode) => {
    if (!isFieldVisible(field)) return null;

    const value = formValues[field.id] ?? field.defaultValue ?? "";
    const handleInputChange = (e: React.ChangeEvent<any>) => handleChange(field.id, e.target.value);
    const hasError = !!errors[field.id];
    const errorClass = hasError ? "input-error" : "";

    switch (field.renderer) {
      case "select":
        return (
          <select id={field.id} value={value} onChange={handleInputChange} className={errorClass}>
            <option value="">{field.placeholder || "Select..."}</option>
            {field.props?.data?.map((opt: any, i: number) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case "multiselect":
        return <MultiSelectField field={field} value={value} onChange={handleChange} />;

      case "textarea":
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            rows={field.props?.minRows || 3}
            value={value}
            onChange={handleInputChange}
            className={errorClass}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.id}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => handleChange(field.id, e.target.valueAsNumber)}
            min={field.props?.min}
            max={field.props?.max}
            step={field.props?.step || 1}
            placeholder={field.placeholder}
            className={errorClass}
          />
        );

      case "radio":
        return (
          <div id={field.id}>
            {field.props?.options?.map((opt: any) => (
              <label key={opt.value} style={{ marginRight: 10 }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(field.id, opt.value)}
                  className={errorClass}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label>
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errorClass}
            />
            {field.label}
          </label>
        );

      case "switch":
        return (
          <label className="switch">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className={errorClass}
            />
            <span className="slider" />
            {field.label}
          </label>
        );

      case "date":
        return <input type="date" id={field.id} value={value} onChange={handleInputChange} className={errorClass} />;

      case "file":
        return (
          <input
            type="file"
            id={field.id}
            accept={field.props?.accept}
            multiple={field.props?.multiple || false}
            onChange={(e) => handleChange(field.id, e.target.files)}
            className={errorClass}
          />
        );

      default:
        return (
          <input
            id={field.id}
            type={field.inputType || "text"}
            placeholder={field.placeholder}
            value={value}
            onChange={handleInputChange}
            className={errorClass}
          />
        );
    }
  };

  // ---------- Render Layout ----------
  const renderLayoutNode = (node: LayoutNode, index?: number): JSX.Element | null => {
    const key = node.fieldId || node.title || `${node.kind}-${index}`;

    switch (node.kind) {
      case "field": {
        const field = fields[node.fieldId!];
        if (!field || !isFieldVisible(field)) return null;
        return (
          <div key={field.id} className={fieldClassName || "form-field"}>
            {field.renderer !== "checkbox" && field.renderer !== "switch" && (
              <label htmlFor={field.id}>{field.label}</label>
            )}
            {renderField(field)}
            {errors[field.id] && <p className="error-text">{errors[field.id]}</p>}
          </div>
        );
      }

      case "stack":
        return (
          <div key={key} className={`stack stack-${node.spacing || "md"}`}>
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </div>
        );

      case "grid":
        return (
          <div key={key} className={`grid grid-cols-${node.cols || 2} gap-${node.spacing || "md"}`}>
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </div>
        );

      case "section":
        return (
          <fieldset key={key} className="form-section">
            {node.title && <h3 className="section-title">{node.title}</h3>}
            {node.children?.map((child, i) => renderLayoutNode(child, i))}
          </fieldset>
        );

      default:
        return null;
    }
  };

  // ---------- Render Form ----------
  return (
    <div className={className || "dynamic-form"}>
      {meta.title && <h1 className="form-h1">{meta.title}</h1>}
      {meta.subtitle && <h2 className="form-h2">{meta.subtitle}</h2>}

      <form id={id} onSubmit={handleSubmit}>
        {layout?.map((node, i) => renderLayoutNode(node, i))}
        <div className="form-buttons">
          <button type="submit" className={buttonClassName}>Submit</button>
          <button type="reset" onClick={handleReset} className={buttonClassName}>Reset</button>
        </div>
      </form>
    </div>
  );
}

// ---------- MultiSelect Component ----------
function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: FieldNode;
  value: string[];
  onChange: (id: string, value: any) => void;
}) {
  const [search, setSearch] = useState("");
  const options = field.props?.data || [];
  const selected = value || [];

  const filtered = field.props?.searchable
    ? options.filter((o: any) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (opt: any) => {
    const newVals = selected.includes(opt.value)
      ? selected.filter((v) => v !== opt.value)
      : [...selected, opt.value];
    onChange(field.id, newVals);
  };

  const remove = (opt: any) =>
    onChange(field.id, selected.filter((v) => v !== opt.value));

  return (
    <div className="multiselect-wrapper">
      {field.props?.searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      )}
      <div className="options-list">
        {filtered.map((opt, i) => (
          <div
            key={i}
            className={`option-item ${selected.includes(opt.value) ? "selected" : ""}`}
            onClick={() => toggle(opt)}
          >
            {opt.label}
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="selected-tags">
          {selected.map((item, i) => (
            <span key={i} className="tag">
              {item}
              <button onClick={() => remove({ value: item })} type="button">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

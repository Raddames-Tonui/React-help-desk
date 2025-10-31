import React, { useState } from "react";
import "./formstyle.css";
import { validateField } from "./utils/valitation";
import type { DynamicFormProps, FieldNode } from "./utils/types";

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const { id, meta, fields } = schema;
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if field is visible 
  const isFieldVisible = (field: FieldNode): boolean => {
    const rule = field.visibleWhen;
    if (!rule) return true;

    const checkCondition = (condition: any) => {
      const targetValue = formValues[condition.field];
      switch (condition.op) {
        case "equals":
          return targetValue === condition.value;
        case "in":
          return Array.isArray(condition.value) && condition.value.includes(targetValue);
        default:
          return true;
      }
    };

    return Array.isArray(rule)
      ? rule.every(checkCondition)
      : checkCondition(rule);
  };

  // Handle change + validation 
  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [fieldId]: value };
      Object.values(fields).forEach((field) => {
        if (!isFieldVisible(field)) updatedValues[field.id] = undefined;
      });
      return updatedValues;
    });

    const field = fields[fieldId];
    const error = validateField(field, value, { ...formValues, [fieldId]: value });
    setErrors((prev) => ({ ...prev, [fieldId]: error || "" }));
  };

  // Submit 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    Object.values(fields).forEach((field) => {
      if (!isFieldVisible(field)) return;
      const value = formValues[field.id];
      const error = validateField(field, value, formValues);
      if (error) validationErrors[field.id] = error;
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit?.(formValues);
    }
  };

  // Reset 
  const handleReset = () => {
    setFormValues({});
    setErrors({});
  };

  // Render each field 
  const renderField = (field: FieldNode) => {
    const value = formValues[field.id] ?? field.defaultValue ?? "";
    const handleInputChange = (e: React.ChangeEvent<any>) => handleChange(field.id, e.target.value);

    switch (field.renderer) {
      case "select":
        return (
          <select id={field.id} value={value} onChange={handleInputChange}>
            <option value="">{field.placeholder || "Select..."}</option>
            {field.props?.data?.map((option: any, index: number) => {
              const optionValue = typeof option === "object" ? option.value : option;
              const optionLabel = typeof option === "object" ? option.label : option;
              return <option key={index} value={optionValue}>{optionLabel}</option>;
            })}
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
          />
        );

      case "number":
        return (
          <input
            id={field.id}
            type="number"
            value={value}
            min={field.props?.min}
            max={field.props?.max}
            step={field.props?.step || 1}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field.id, e.target.valueAsNumber)}
          />
        );

      case "radio":
        return (
          <div id={field.id}>
            {field.props?.options?.map((option: any) => (
              <label key={option.value} style={{ marginRight: 10 }}>
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleChange(field.id, option.value)}
                />
                {option.label}
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
            />
            <span className="slider" />
            {field.label}
          </label>
        );

      case "date":
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={handleInputChange}
          />
        );

      case "file":
        return (
          <input
            id={field.id}
            type="file"
            accept={field.props?.accept}
            multiple={field.props?.multiple || false}
            onChange={(e) => handleChange(field.id, e.target.files)}
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
          />
        );
    }
  };

  // Render form 
  return (
    <div className="dynamic-form">
      {meta.title && <h1 className="form-h1">{meta.title}</h1>}
      {meta.subtitle && <h2 className="form-h2">{meta.subtitle}</h2>}

      <form id={id} onSubmit={handleSubmit}>
        {Object.values(fields)
          .filter(isFieldVisible)
          .map((field) => (
            <div key={field.id} className="form-field">
              {field.renderer !== "checkbox" && field.renderer !== "switch" && (
                <label htmlFor={field.id}>{field.label}</label>
              )}
              {renderField(field)}
              {errors[field.id] && (
                <p className="error-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="error-icon"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="7" x2="12" y2="13" />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                  </svg>
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}

        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}

// Custom multi-select with search + tag removal
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

  const allOptions = field.props?.data || [];
  const selected = value || [];

  const filteredOptions = field.props?.searchable
    ? allOptions.filter((opt: string) =>
        opt.toLowerCase().includes(search.toLowerCase())
      )
    : allOptions;

  const toggleValue = (option: string) => {
    const newValues = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(field.id, newValues);
  };

  const removeValue = (option: string) => {
    onChange(field.id, selected.filter((v) => v !== option));
  };

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
        {filteredOptions.map((option: string, index: number) => (
          <div
            key={index}
            className={`option-item ${selected.includes(option) ? "selected" : ""}`}
            onClick={() => toggleValue(option)}
          >
            {option}
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="selected-tags">
          {selected.map((item: string, index: number) => (
            <span key={index} className="tag">
              {item}
              <button onClick={() => removeValue(item)} type="button">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

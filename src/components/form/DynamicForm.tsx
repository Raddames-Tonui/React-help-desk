import React, { useState } from "react";

interface FieldNode {
  id: string;
  label: string;
  renderer:  "text"| "select"| "textarea"| "checkbox"| "number"| "radio"| "file";
  inputType?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  props?: Record<string, any>;
  defaultValue?: any;
}

export interface FormProps {
  id: string;
  meta: {
    title?: string;
    subtitle?: string;
  };
  fields: Record<string, FieldNode>;
  layout: any[];
}

const DynamicForm: React.FC<{ props: FormProps }> = ({ props }) => {
  const { id, meta, fields } = props;

  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleReset = () => setFormValues({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
  };

  const renderField = (field: FieldNode) => {
    const value = formValues[field.id] ?? field.defaultValue ?? "";

    switch (field.renderer) {
      case "select":
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.props?.data?.map((opt: any) =>
              typeof opt === "string" ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )
            )}
          </select>
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
            {field.props?.options?.map((opt: any) => (
              <label key={opt.value} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(field.id, opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            rows={field.props?.minRows || 3}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
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

      case "file":
        return (
          <div>
            <label htmlFor={field.id}>{field.label}</label>
            <input
              id={field.id}
              type="file"
              accept={field.props?.accept || "*/*"}
              multiple={field.props?.multiple || false}
              data-max-size={field.props?.maxSize || undefined}
              onChange={(e) => handleChange(field.id, e.target.files)}
            />
          </div>
        );

      default:
        return (
          <input
            id={field.id}
            type={field.inputType || "text"}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="dynamic-form">
      {meta.title && <h1>{meta.title}</h1>}
      {meta.subtitle && <h2>{meta.subtitle}</h2>}

      <form id={id} onSubmit={handleSubmit}>
        {Object.values(fields).map((field) => (
          <div key={field.id} className="form-field" style={{ marginBottom: "0.5rem" }}>
            {field.renderer !== "checkbox" && (
              <label htmlFor={field.id}>{field.label}</label>
            )}
            {renderField(field)}
          </div>
        ))}

        <div>
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset} >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;

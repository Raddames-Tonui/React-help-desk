import React, { useState } from "react";
import "./formstyle.css"
import { isFieldVisible, validateField } from "./utils/Validation";

// interface rulesSchema {
//   required?: string | boolean;
//   minLength?: { value: number; message: string };
//   maxLength?: { value: number; message: string };
//   pattern?: { value: RegExp; message: string };
//   min?: { value: number; message: string };
//   max?: { value: number; message: string };
//   validate?: (value, allValues) => string | true;
// }

interface FieldNode {
  id: string;
  label: string;
  renderer: "text" | "select" | "textarea" | "checkbox" | "number" | "radio" | "file";
  inputType?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  props?: Record<string, any>;
  defaultValue?: any;
}

export interface FormSchema {
  id: string;
  meta: {
    title?: string;
    subtitle?: string;
  };
  fields: Record<string, FieldNode>;
  layout: any[];
}

export interface DynamicFormProps {
  schema: FormSchema;
  onSubmit?: (Values: Record<string, any>) => void;
}


const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const { id, meta, fields } = schema;

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    for (const fieldId of Object.keys(fields)) {
      const field = fields[fieldId];
      if (!isFieldVisible(field, formValues)) continue;

      const error = validateField(field, formValues[fieldId], formValues);
      if (error) newErrors[fieldId] = error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formValues);
    }

    // if (onSubmit) {
    //   onSubmit(formValues);
    // } else {
    //   console.log("Form submitted:", formValues);
    // }
  };


  const handleReset = () => setFormValues({});


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
            <option value="">{field.placeholder}</option>
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
              accept={field.props?.accept}
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
      <h1 className="form-h1">{meta.title}</h1>
      <h2 className="form-h2">{meta.subtitle}</h2>


      <form id={id} onSubmit={handleSubmit}>
        {Object.values(fields).map((field) => (
          <div key={field.id} className="form-field">
            {field.renderer !== "checkbox" && (
              <label htmlFor={field.id}> {field.label}</label>
            )}
            {renderField(field)}
            {errors[field.id] && (
              <p className="error-text">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <div className="form-buttons">
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

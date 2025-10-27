import React from "react";

interface FieldNode {
  id: string;
  label: string;
  renderer: "text" | "select" | "textarea" | "checkbox";
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
    [key: string]: any;
  };
  fields: Record<string, FieldNode>;
  layout: any[];
}

const DynamicForm: React.FC<{ props: FormProps }> = ({ props }) => {
  const { id, meta, fields } = props;

  const renderField = (field: FieldNode) => {
    switch (field.renderer) {
      case "select":
        return (
          <select id={field.id} {...field.props}>
            <option value="">Select an option</option>
            {field.props?.data?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={field.id}
            placeholder={field.placeholder}
            rows={field.props?.minRows || 3}
          />
        );
      case "checkbox":
        return (
          <label>
            <input type="checkbox" id={field.id} defaultChecked={field.defaultValue} />
            {field.label}
          </label>
        );
      default:
        return (
          <input
            id={field.id}
            type={field.inputType || "text"}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="dynamic-form">
      {meta.title && <h1>{meta.title}</h1>}
      {meta.subtitle && <h2>{meta.subtitle}</h2>}

      <form id={id}>
        {Object.values(fields).map((field) => (
          <div key={field.id} className="form-field">
            {field.renderer !== "checkbox" && <label htmlFor={field.id}>{field.label}</label>}
            {renderField(field)}
          </div>
        ))}
      </form>
    </div>
  );
};

export default DynamicForm;

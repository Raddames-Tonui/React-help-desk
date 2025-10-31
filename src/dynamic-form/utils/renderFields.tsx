import type { FieldNode } from "./types";

  export const renderField = (field: FieldNode) => {
    const value = formValues[field.id] ?? field.defaultValue ?? "";

    switch (field.renderer) {
      case "select":
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          >
            <option value="">{field.placeholder || "Select..."}</option>
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
      case "date":
        return (
          <label>
            <input
              type="date"
              id={field.id}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
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
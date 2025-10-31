export interface FieldNode {
    id: string;
    label: string;
    renderer: "text"| "select"| "textarea"| "checkbox"| "number"| "radio"| "file" | "date";
    inputType?: string;
    placeholder?: string;
    rules?: Record<string, any>;
    props?: Record<string, any>;
    defaultValue?: any;
    visibleWhen?: any;
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

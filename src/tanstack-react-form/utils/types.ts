export interface FieldNode {
    id: string;
    label: string;
    renderer: "text"| "select"| "textarea"| "checkbox"| "number"| "radio"| "file" | "date" | "switch" | "multiselect";
    inputType?: string;
    placeholder?: string;
    rules?: Record<string, any>;
    props?: Record<string, any>;
    defaultValue?: any;
    visibleWhen?: any;
}

export interface LayoutNode {
  type: 'row' | 'column' | 'tabs' | 'group' | 'field';
  id?: string;
  fieldId?: string;
  children?: LayoutNode[];
  fields?: string[];
  props?: Record<string, any>;
}

export interface FormSchema {
  id: string;
  meta: {
    title?: string;
    subtitle?: string;
  };
  fields: Record<string, FieldNode>;
  layout: LayoutNode[];
}

export interface DynamicFormProps {
  schema: FormSchema;
  onSubmit?: (Values: Record<string, any>) => void;
}


export interface VisibilityRule {
  field: string;
  op: 'equals' | 'in';
  value: any;
}

export interface FieldNode {
  id: string;
  label: string;
  renderer: "text"| "select"| "textarea"| "checkbox"| "number"| "radio"| "file" | "date" | "switch" | "multiselect";
  inputType?: string;
  placeholder?: string;
  rules?: {
    required?: string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any, formValues: Record<string, any>) => string | null;
  };
  props?: {
    data?: { label: string; value: any }[];
    options?: { label: string; value: any }[];
    minRows?: number;
    maxRows?: number;
    multiple?: boolean;
    searchable?: boolean;
    accept?: string;
    [key: string]: any;
  };
  defaultValue?: string | number | boolean | string[] | File | Date;
  visibleWhen?: VisibilityRule | VisibilityRule[];
}

export interface LayoutNode {
  kind: 'field' | 'stack' | 'grid' | 'section';
  type?: 'row' | 'column' | 'tabs' | 'group';
  id?: string;
  fieldId?: string;
  title?: string;
  colSpan?: number;
  cols?: number;
  spacing?: string;
  withDivider?: boolean;
  tabLabels?: string[];
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

export interface DynamicFormProps<T = Record<string, any>> {
  schema: FormSchema;
  onSubmit?: (values: T) => void;
  initialData?: T;
  className?: string;
  fieldClassName?: string;
  buttonClassName?: string;
}

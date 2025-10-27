import DynamicForm from '@/components/form/DynamicForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dynamicforms/product/form')({
  component: RouteComponent,
})

const productFormSchema: any = {
    id: "product-form",
    meta: {
        title: "Add Product",
        subtitle: "Fill in product details"
    },
    fields: {
        // Basic Info
        productName: {
            id: "productName",
            label: "Product Name",
            renderer: "text",
            rules: { required: "Product name is required" }
        },
        category: {
            id: "category",
            label: "Category",
            renderer: "select",
            props: {
                data: [
                    { label: "Electronics", value: "electronics" },
                    { label: "Clothing", value: "clothing" },
                    { label: "Food", value: "food" },
                    { label: "Books", value: "books" }
                ]
            },
            rules: { required: "Category is required" }
        },

        // Electronics Fields
        brand: {
            id: "brand",
            label: "Brand",
            renderer: "text",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "electronics"
            },
            rules: { required: "Brand is required for electronics" }
        },
        warrantyPeriod: {
            id: "warrantyPeriod",
            label: "Warranty Period (months)",
            renderer: "number",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "electronics"
            },
            props: {
                min: 0,
                max: 60
            }
        },

        // Clothing Fields
        size: {
            id: "size",
            label: "Size",
            renderer: "select",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "clothing"
            },
            props: {
                data: ["XS", "S", "M", "L", "XL", "XXL"]
            }
        },
        color: {
            id: "color",
            label: "Color",
            renderer: "multiselect",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "clothing"
            },
            props: {
                data: ["Red", "Blue", "Green", "Black", "White", "Yellow"]
            }
        },

        // Food Fields
        expiryDate: {
            id: "expiryDate",
            label: "Expiry Date",
            renderer: "date",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "food"
            },
            props: {
                minDate: new Date()
            },
            rules: { required: "Expiry date is required for food items" }
        },

        // Common Fields
        price: {
            id: "price",
            label: "Price (KES)",
            renderer: "number",
            props: {
                min: 0,
                precision: 2,
                step: 0.01
            },
            rules: {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" }
            }
        },
        discountApplied: {
            id: "discountApplied",
            label: "Apply Discount",
            renderer: "switch",
            defaultValue: false
        },
        discountPercentage: {
            id: "discountPercentage",
            label: "Discount Percentage",
            renderer: "number",
            visibleWhen: {
                field: "discountApplied",
                op: "equals",
                value: true
            },
            props: {
                min: 0,
                max: 100,
                suffix: "%"
            },
            rules: {
                required: "Discount percentage is required",
                min: { value: 1, message: "Discount must be at least 1%" },
                max: { value: 90, message: "Discount cannot exceed 90%" }
            }
        },
        stock: {
            id: "stock",
            label: "Stock Quantity",
            renderer: "number",
            props: {
                min: 0
            },
            rules: {
                required: "Stock quantity is required",
                min: { value: 0, message: "Stock cannot be negative" }
            }
        },
        description: {
            id: "description",
            label: "Description",
            renderer: "textarea",
            props: {
                minRows: 4
            }
        },
        featured: {
            id: "featured",
            label: "Feature this product",
            renderer: "checkbox",
            defaultValue: false
        }
    },
    layout: [
        {
            kind: "section",
            title: "Basic Information",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "productName" },
                        { kind: "field", fieldId: "category" }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Category-Specific Details",
            withDivider: true,
            collapsible: true,
            children: [
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "brand" },
                        { kind: "field", fieldId: "warrantyPeriod" },
                        { kind: "field", fieldId: "size" },
                        { kind: "field", fieldId: "color" },
                        { kind: "field", fieldId: "expiryDate" }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Pricing & Inventory",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 3,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "price" },
                        { kind: "field", fieldId: "stock" },
                        { kind: "field", fieldId: "discountApplied" },
                        { kind: "field", fieldId: "discountPercentage", colSpan: 2 }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Additional Information",
            withDivider: false,
            children: [
                {
                    kind: "stack",
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "description" },
                        { kind: "field", fieldId: "featured" }
                    ]
                }
            ]
        }
    ]
};
function RouteComponent() {
  return <div>

    <DynamicForm schema={productFormSchema} />
  </div>
}

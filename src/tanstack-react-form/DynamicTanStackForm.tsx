import { useForm } from "@tanstack/react-form"
import type { DynamicFormProps, FormSchema } from "./utils/types"
import { LayoutRenderer } from "./components/LayoutRenderer"
import "./css/formstyle.css"

function getDefaultValues(schema: FormSchema): Record<string, any> {
    const values: Record<string, any> = {}
    Object.values(schema.fields).forEach((f) => {
        values[f.id] =
            f.defaultValue ??
            (f.renderer === "checkbox" || f.renderer === "switch" ? false : "")
    })
    return values
}


export function DynamicTanStackForm({
    schema,
    onSubmit,
}: DynamicFormProps) {
    const form = useForm({
        defaultValues: getDefaultValues(schema),
        onSubmit: async ({ value }) => onSubmit?.(value),
    })

    const layout =
        schema.layout ?? [
            {
                kind: "stack",
                spacing: "md",
                children: Object.keys(schema.fields).map((id) => ({
                    kind: "field",
                    fieldId: id,
                })),
            },
        ]


    return (
        <div className="dynamic-form">
            {schema.meta?.title && <h1 className="form-h1">{schema.meta.title}</h1>}
            {schema.meta?.subtitle && (<h2 className="form-h2">{schema.meta.subtitle}</h2>)}

            <form id={schema.id}
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                {layout.map((node: any, i: number) => (
                    <LayoutRenderer
                        key={i}
                        node={node}
                        schema={schema}
                        form={form}
                    />
                ))}

                <div className="form-buttons">
                    <button type="submit">Submit</button>
                    <button
                        type="reset"
                        onClick={() => {
                            form.reset()
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    )
}

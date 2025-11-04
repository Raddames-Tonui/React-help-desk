import React from 'react'
import { FieldRenderer } from './FieldRenderer'
import type { UseFormReturn } from 'react-hook-form'

export function LayoutRenderer({
  node,
  schema,
  form,
}: {
  node: any
  schema: any
  form: UseFormReturn<any>
}) {
  switch (node.kind) {
    case 'field':
      return <FieldRenderer fieldDef={schema.fields[node.fieldId]} form={form} />
    case 'stack':
      return (
        <div className="stack">
          {node.children?.map((c: any, i: number) => (
            <LayoutRenderer key={i} node={c} schema={schema} form={form} />
          ))}
        </div>
      )
    case 'grid':
      return (
        <div className="grid">
          {node.children?.map((c: any, i: number) => (
            <LayoutRenderer key={i} node={c} schema={schema} form={form} />
          ))}
        </div>
      )
    case 'section':
      return (
        <section>
          {node.title && <h3>{node.title}</h3>}
          {node.withDivider && <hr />}
          {node.children?.map((c: any, i: number) => (
            <LayoutRenderer key={i} node={c} schema={schema} form={form} />
          ))}
        </section>
      )
    default:
      return null
  }
}

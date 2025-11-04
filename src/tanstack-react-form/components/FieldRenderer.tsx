import React from 'react'
import { makeValidatorsFromRules } from '../utils/validators'
import { isFieldVisible } from '../utils/visibility'
import { MultiSelect } from './MultiSelect'
import type { UseFormReturn } from 'react-hook-form'

export function FieldRenderer({
  fieldDef,
  form,
}: {
  fieldDef: any
  form: UseFormReturn<any>
}) {
  const name = fieldDef.id
  const validators = makeValidatorsFromRules(fieldDef.rules)
  const visible = isFieldVisible(fieldDef, (n) => form.getFieldValue(n))
  if (!visible) return null

  return (
    <form.Field
      name={name}
      validators={{
        onChange: validators.onChange
          ? ({ value }) => validators.onChange!({ value, formValues: form.state.values })
          : undefined,
        onSubmit: validators.onSubmit
          ? ({ value }) => validators.onSubmit!({ value, formValues: form.state.values })
          : undefined,
      }}
    >
      {(field) => {
        const onText = (e: any) => field.handleChange(e.target.value)
        const onNumber = (e: any) => field.handleChange(e.target.valueAsNumber)
        const onCheck = (e: any) => field.handleChange(e.target.checked)

        let control: React.ReactNode

        switch (fieldDef.renderer) {
          case 'select':
            control = (
              <select id={name} value={field.state.value ?? ''} onChange={onText}>
                <option value="">{fieldDef.placeholder ?? 'Select…'}</option>
                {(fieldDef.props?.data ?? []).map((opt: any, i: number) => {
                  const val = typeof opt === 'object' ? opt.value : opt
                  const label = typeof opt === 'object' ? opt.label : opt
                  return (
                    <option key={i} value={val}>
                      {label}
                    </option>
                  )
                })}
              </select>
            )
            break
          case 'multiselect':
            control = (
              <MultiSelect
                id={name}
                options={fieldDef.props?.data ?? []}
                value={field.state.value ?? []}
                searchable={!!fieldDef.props?.searchable}
                onChange={(arr) => field.handleChange(arr)}
              />
            )
            break
          case 'textarea':
            control = (
              <textarea
                id={name}
                placeholder={fieldDef.placeholder}
                rows={fieldDef.props?.minRows ?? 3}
                value={field.state.value ?? ''}
                onChange={onText}
              />
            )
            break
          case 'number':
            control = (
              <input
                id={name}
                type="number"
                min={fieldDef.props?.min}
                max={fieldDef.props?.max}
                step={fieldDef.props?.step ?? 1}
                value={field.state.value ?? ''}
                onChange={onNumber}
              />
            )
            break
          case 'radio':
            control = (
              <div id={name}>
                {fieldDef.props?.options?.map((opt: any) => (
                  <label key={opt.value} style={{ marginRight: 10 }}>
                    <input
                      type="radio"
                      name={name}
                      value={opt.value}
                      checked={field.state.value === opt.value}
                      onChange={() => field.handleChange(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )
            break
          case 'checkbox':
            control = (
              <label>
                <input
                  type="checkbox"
                  id={name}
                  checked={!!field.state.value}
                  onChange={onCheck}
                />
                {fieldDef.label}
              </label>
            )
            break
          case 'switch':
            control = (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!field.state.value}
                  onChange={onCheck}
                />
                <span className="slider" />
                {fieldDef.label}
              </label>
            )
            break
          case 'date':
            control = (
              <input
                type="date"
                id={name}
                value={field.state.value ?? ''}
                onChange={onText}
              />
            )
            break
          default:
            control = (
              <input
                id={name}
                type={fieldDef.inputType || 'text'}
                placeholder={fieldDef.placeholder}
                value={field.state.value ?? ''}
                onChange={onText}
              />
            )
        }

        return (
          <div className="form-field">
            {fieldDef.renderer !== 'checkbox' && fieldDef.renderer !== 'switch' && (
              <label htmlFor={name}>{fieldDef.label}</label>
            )}
            {control}
            {field.state.meta.errors.length > 0 && (
              <p className="error-text">{field.state.meta.errors.join(', ')}</p>
            )}
          </div>
        )
      }}
    </form.Field>
  )
}

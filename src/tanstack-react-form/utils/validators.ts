type ValidatorFn = (ctx: {
  value: any
  formValues: Record<string, any>
}) => string | undefined

export function makeValidatorsFromRules(rules: any): {
  onChange?: ValidatorFn
  onSubmit?: ValidatorFn
} {
  if (!rules) return {}

  const validateCore: ValidatorFn = ({ value, formValues }) => {
    if (rules.required) {
      const isEmpty =
        value === '' || value === undefined ||
        (Array.isArray(value) && value.length === 0)
      if (isEmpty) return typeof rules.required === 'string' ? rules.required : 'Required'
    }

    if (rules.minLength && value?.length < rules.minLength.value)
      return rules.minLength.message

    if (rules.maxLength && value?.length > rules.maxLength.value)
      return rules.maxLength.message

    if (rules.min && Number(value) < rules.min.value)
      return rules.min.message

    if (rules.max && Number(value) > rules.max.value)
      return rules.max.message

    if (rules.pattern?.value && !rules.pattern.value.test(String(value)))
      return rules.pattern.message

    if (typeof rules.validate === 'function') {
      const msg = rules.validate(value, formValues)
      if (typeof msg === 'string') return msg
    }

    return undefined
  }

  return {
    onChange: validateCore,
    onSubmit: validateCore,
  }
}

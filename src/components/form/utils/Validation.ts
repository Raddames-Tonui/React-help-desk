export const validateField = (field: any, value: any, allValues: Record<string, any>) => {
  const rules = field.rules || {};
  const label = field.label || field.id;

  if (rules.required) {
    const message = typeof rules.required === "string"
      ? rules.required
      : `${label} is required`;
    if (value === "" || value === undefined || value === null || value === false) {
      return message;
    }
  }

  if (rules.minLength && value?.length < rules.minLength.value)
    return rules.minLength.message;
  if (rules.maxLength && value?.length > rules.maxLength.value)
    return rules.maxLength.message;

  if (rules.pattern && value && !rules.pattern.value.test(value))
    return rules.pattern.message;

  if (rules.min && +value < rules.min.value)
    return rules.min.message;
  if (rules.max && +value > rules.max.value)
    return rules.max.message;

  if (rules.validate) {
    const result = rules.validate(value, allValues);
    if (result !== true) return result;
  }

  return null;
};

export const isFieldVisible = (field: any, formValues: Record<string, any>): boolean => {
  const condition = field.visibleWhen;
  if (!condition) return true;

  const evalCondition = (cond: any) => {
    const targetValue = formValues[cond.field];
    switch (cond.op) {
      case "equals": return targetValue === cond.value;
      case "notEquals": return targetValue !== cond.value;
      case "in": return Array.isArray(cond.value) && cond.value.includes(targetValue);
      case "notIn": return Array.isArray(cond.value) && !cond.value.includes(targetValue);
      default: return true;
    }
  };

  return Array.isArray(condition)
    ? condition.every(evalCondition)
    : evalCondition(condition);
};

export function isFieldVisible(
    field: any,
    getValue: (name: string) => any
): boolean {
    const rule = field.visibleWhen
    if (!rule) return true

    const check = (cond: any) => {
        const targetValue = getValue(cond.field)
        switch (cond.op) {
            case 'equals':
                return targetValue === cond.value
            case 'in':
                return Array.isArray(cond.value) && cond.value.includes(targetValue)
            default:
                return true
        }
    }

    return Array.isArray(rule) ? rule.every(check) : check(rule)
}
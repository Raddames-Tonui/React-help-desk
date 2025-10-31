import type { FieldNode } from "./types";

export const validateField = (
    field: FieldNode,
    value: any,
    allValues: Record<string, any>
): string | null => {
    const rules = field.rules;
    if (!rules) return null;

    // Required
    if (
        rules.required && 
        (value === undefined || value === "" || value === null || value === false)
    ) {
        return typeof rules.required === "string" 
            ? rules.required
            : "This field is required";
    }

    // Min length
    if (
        rules.minLength &&
        typeof value === "string" &&
        value.length < rules.minLength.value
    ) {
        return rules.minLength.message || `Minimum length is ${rules.minLength.value}`;
    }
    
    // Max length
    if (
        rules.maxLength &&
        typeof value === "string" && 
        value.length > rules.maxLength.value
    ) {
        return rules.maxLength.message || `Maximum length is ${rules.maxLength.value}`;
    }

    // Pattern (regex)
    if (rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.value.test(value)
    ) {
        return rules.pattern.message || "Invalid format";
    }
    

    // Min/Max (for numbers)
    if (
        rules.min &&
        typeof value === "number" && 
        value < rules.min.value
    ) {
        return rules.min.message || `Value must be >= ${rules.min.value}`;
    }

    if (
        rules.max &&
        typeof value === "number" &&
        value > rules.max.value
    ) {
        return rules.max.message || `Value must be <= ${rules.max.value}`;    
    }
    
    // Custom validator
    if (typeof rules.validate === "function") {
        const result = rules.validate(value, allValues);
        if (result !== true && result !== undefined) return result;
    }

    return null;
}
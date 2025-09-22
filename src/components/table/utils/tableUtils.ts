// src/utils/tableUtils.ts
export type FilterRule<T = any> = { column: keyof T; operator: string; value: string };

/**
 * Apply client-side filtering based on rules.
 */
export function filterData<T>(data: T[], filters: FilterRule<T>[]): T[] {
    if (!filters.length) return data;

    return data.filter(item =>
        filters.every(f => {
            const val = item[f.column];
            if (val == null) return false;

            const stringVal = String(val).toLowerCase();
            const filterVal = f.value.toLowerCase();

            switch (f.operator) {
                case "eq":
                    return stringVal === filterVal;
                case "ne":
                    return stringVal !== filterVal;
                case "contains":
                    return stringVal.includes(filterVal);
                case "startswith":
                    return stringVal.startsWith(filterVal);
                case "endswith":
                    return stringVal.endsWith(filterVal);
                // case "gt":
                //     return Number(val) > Number(f.value);
                // case "lt":
                //     return Number(val) < Number(f.value);
                // case "ge":
                //     return Number(val) >= Number(f.value);
                // case "le":
                //     return Number(val) <= Number(f.value);
                default:
                    return false;
            }
        })
    );
}

/**
 * Apply client-side sorting based on rules.
 */
export interface SortRule<T> {
    column: keyof T;
    direction: "asc" | "desc";
}

export function sortData<T extends Record<string, any>>(data: T[], sortRules: SortRule<T>[]): T[] {
    if (!sortRules.length) return data;

    const sorted = [...data];

    sortRules.forEach(rule => {
        sorted.sort((a, b) => {
            const valA = a[rule.column];
            const valB = b[rule.column];

            if (valA == null) return 1;
            if (valB == null) return -1;
            if (valA === valB) return 0;

            return rule.direction === "asc"
                ? valA > valB
                    ? 1
                    : -1
                : valA < valB
                    ? 1
                    : -1;
        });
    });

    return sorted;
}
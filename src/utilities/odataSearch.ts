// utils/odataSearch.ts
export function buildODataSearchFilter(search: string, filter: string | null, fields: string[]): string {
  if (!search) return filter || '';

  const q = search.replace(/'/g, "''"); // escape single quotes
  const searchFilter = fields.map(f => `contains(${f}, '${q}')`).join(' or ');

  return filter ? `(${filter}) and (${searchFilter})` : searchFilter;
}

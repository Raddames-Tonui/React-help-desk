import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// --- Types ---
export interface Address {
  Address: string;
  City: { Name: string; CountryRegion: string; Region: string };
}

export interface Person {
  UserName: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  Gender: string;
  Age: number | null;
  Emails: string[];
  FavoriteFeature: string;
  Features: string[];
  AddressInfo: Address[];
  HomeAddress: string | null;
}

export interface OdataResponse<T> {
  value: T[];
  ["@odata.count"]?: number;
}

export interface SortRule { column: string; direction: "asc" | "desc" }
export interface FilterRule { column: string; operator: string; value: string }

interface ODataContextType {
  page: number;
  pageSize: number;
  sortBy: SortRule[];
  filter: FilterRule[];
  search: string[];
  setPage: (page: number) => void;
  setSortBy: (rules: SortRule[]) => void;
  setFilter: (rules: FilterRule[]) => void;
  setSearch: (arr: string[]) => void;
  data: Person[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

const ODataContext = createContext<ODataContextType | undefined>(undefined);

// ---- Serialization helpers for OData query ----
const serializeSort = (rules: SortRule[]): string => rules.map(r => `${r.column} ${r.direction}`).join(",");
const serializeFilter = (rules: FilterRule[]): string =>
  rules
    .map(r =>
      ["contains", "startswith", "endswith"].includes(r.operator)
        ? `${r.operator}(${r.column},'${r.value}')`
        : `${r.column} ${r.operator} '${r.value}'`
    )
    .join(" and ");
const serializeSearch = (arr: string[]): string => arr.join(" ");

// ---- Fetch function ----
async function fetchPeople(
  page: number,
  pageSize: number,
  sortBy: SortRule[],
  filter: FilterRule[],
  search: string[]
): Promise<OdataResponse<Person>> {
  const skip = (page - 1) * pageSize;
  const params = new URLSearchParams({
    $top: pageSize.toString(),
    $skip: skip.toString(),
    $count: "true",
  });

  const orderBy = serializeSort(sortBy);
  const filterStr = serializeFilter(filter);
  const searchStr = serializeSearch(search);

  if (orderBy) params.set("$orderby", orderBy);
  if (filterStr) params.set("$filter", filterStr);
  if (searchStr) params.set("$search", searchStr);

  const url = `https://services.odata.org/TripPinRESTierService/(S(readwrite))/People?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch people");
  return res.json();
}

// ---- Provider ----
export function ODataProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortRule[]>([]);
  const [filter, setFilter] = useState<FilterRule[]>([]);
  const [search, setSearch] = useState<string[]>([]);

  const queryKey = useMemo(() => ["people", page, pageSize, sortBy, filter, search], [page, pageSize, sortBy, filter, search]);

  const query = useQuery<OdataResponse<Person>, Error>({
    queryKey,
    queryFn: () => fetchPeople(page, pageSize, sortBy, filter, search),
    keepPreviousData: true,
  });

  return (
    <ODataContext.Provider
      value={{
        page,
        pageSize,
        sortBy,
        filter,
        search,
        setPage,
        setSortBy,
        setFilter,
        setSearch,
        data: query.data?.value ?? [],
        total: query.data?.["@odata.count"] ?? 0,
        isLoading: query.isLoading,
        error: query.error ?? null,
        refresh: () => query.refetch(),
      }}
    >
      {children}
    </ODataContext.Provider>
  );
}

// ---- Hook ----
export function useOData() {
  const context = useContext(ODataContext);
  if (!context) throw new Error("useOData must be used within ODataProvider");
  return context;
}

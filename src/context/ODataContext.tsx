// ODataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPeople, Person, OdataResponse } from "./odataApi";

interface ODataContextType {
    page: number;
    pageSize: number;
    sortBy: string;
    filter: string;
    search: string;
    setPage: (page: number) => void;
    setSortBy: (sort: string) => void;
    setFilter: (filter: string) => void;
    setSearch: (search: string) => void;
    data: Person[];
    total: number;
    isLoading: boolean;
    error: Error | null; 
    refresh: () => void;
}

const ODataContext = createContext<ODataContextType | undefined>(undefined);

export function ODataProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const query = useQuery<OdataResponse<Person>, Error>({
    queryKey: ["people", page, pageSize, sortBy, filter, search],
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
        error: query.error ?? null,
        isLoading: query.isLoading,
        refresh: () => query.refetch(),
      }}
    >
      {children}
    </ODataContext.Provider>
  );
}

export function useOData() {
  const context = useContext(ODataContext);
  if (!context) {
    throw new Error("useOData must be used within ODataProvider");
  }
  return context;
}

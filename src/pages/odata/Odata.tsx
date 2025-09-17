import React, { useEffect } from "react";
import { DataTable, SortRule, FilterRule } from "../../components/table/DataTable";
import type { ColumnProps } from "../../components/table/DataTable";
import { useOData } from "../../context/ODataContext";
import { Route } from "../../routes/_protected/pages/odata/index";

const Odata: React.FC = () => {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    data,
    total,
    isLoading,
    error,
    page,
    pageSize,
    sortBy,
    filter,
    search,
    setPage,
    setSortBy,
    setFilter,
    setSearch,
  } = useOData<Person>();

  // ---- Parse URL params to arrays for initial state ----
  const parseSortParam = (str: string | undefined): SortRule[] => {
    if (!str) return [];
    return str.split(",").map((s) => {
      const [column, direction = "asc"] = s.trim().split(" ");
      return { column, direction: direction as "asc" | "desc" };
    });
  };

  const parseFilterParam = (str: string | undefined): FilterRule[] => {
    if (!str) return [];
    const decoded = decodeURIComponent(str);
    return decoded.split(/\s+and\s+/i).map((p) => {
      let m = p.match(/^(contains|startswith|endswith)\(\s*([^,\s)]+)\s*,\s*['"]([^'"]+)['"]\s*\)$/i);
      if (m) return { column: m[2], operator: m[1], value: m[3] };
      m = p.match(/^([^ \s]+)\s+(eq|ne|gt|lt|ge|le)\s+['"]([^'"]+)['"]$/i);
      if (m) return { column: m[1], operator: m[2], value: m[3] };
      return { column: "", operator: "contains", value: "" };
    }).filter((r): r is FilterRule => !!r);
  };

  // ---- Sync context with URL on mount ----
  useEffect(() => {
    setPage(searchParams.page ?? 1);
    setSortBy(parseSortParam(searchParams.sortBy));
    setFilter(parseFilterParam(searchParams.filter));
    setSearch(searchParams.search ? [searchParams.search] : []);
  }, [searchParams, setPage, setSortBy, setFilter, setSearch]);

  // ---- Serialize arrays for URL ----
  const serializeSort = (rules: SortRule[]) => rules.map((r) => `${r.column} ${r.direction}`).join(",");
  const serializeFilter = (rules: FilterRule[]) =>
    rules
      .map((r) =>
        ["contains", "startswith", "endswith"].includes(r.operator)
          ? `${r.operator}(${r.column},'${r.value}')`
          : `${r.column} ${r.operator} '${r.value}'`
      )
      .join(" and ");

  // ---- Handle page change ----
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    navigate({
      search: {
        page: newPage,
        pageSize,
        sortBy: serializeSort(sortBy),
        filter: serializeFilter(filter),
        search: search[0] ?? "",
      },
    });
  };

  if (isLoading) return <div className="p-4">Loading people...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const columns: ColumnProps<Person>[] = [
    { id: "UserName", caption: "Username", size: 100, align: "left", isSortable: true, isFilterable: true },
    { id: "FirstName", caption: "First Name", size: 100, isSortable: true, isFilterable: true },
    { id: "LastName", caption: "Last Name", size: 150, isSortable: true, isFilterable: true },
    {
      id: "Gender",
      caption: "Gender",
      size: 100,
      isSortable: true,
      isFilterable: true,
      renderCell: (value) => (
        <span
          style={{
            color: value === "Male" ? "red" : value === "Female" ? "blue" : "inherit",
            fontWeight: "bold",
          }}
        >
          {value}
        </span>
      ),
    },
    {
      id: "Emails",
      caption: "Emails",
      size: 250,
      renderCell: (value) => (value ? value.join(", ") : "—"),
      hide: true,
      isFilterable: true,
    },
    {
      id: "AddressInfo",
      caption: "City",
      size: 150,
      renderCell: (row) => row.AddressInfo?.[0]?.City?.Name ?? "—",
      hide: true,
      isFilterable: true,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
      </div>

      <DataTable<Person>
        columns={columns}
        data={data ?? []}
        pagination={{ page, pageSize, total, onPageChange: handlePageChange }}
        initialSort={sortBy}
        initialFilter={filter}
        initialSearch={search}
        onSortApply={(rules) => {
          setSortBy(rules);
          navigate({
            search: {
              page: 1,
              pageSize,
              sortBy: serializeSort(rules),
              filter: serializeFilter(filter),
              search: search[0] ?? "",
            },
          });
        }}
        onFilterApply={(rules) => {
          setFilter(rules);
          navigate({
            search: {
              page: 1,
              pageSize,
              sortBy: serializeSort(sortBy),
              filter: serializeFilter(rules),
              search: search[0] ?? "",
            },
          });
        }}
        onSearchApply={(arr) => {
          setSearch(arr);
          navigate({
            search: {
              page: 1,
              pageSize,
              sortBy: serializeSort(sortBy),
              filter: serializeFilter(filter),
              search: arr[0] ?? "",
            },
          });
        }}
      />
    </div>
  );
};

export default Odata;

import React, { useEffect } from "react"
import type { ColumnProps } from "../../components/table/DataTable"
import { DataTable } from "../../components/table/DataTable"
import { useOData } from "../../context/ODataContext"
import { Route } from "../../routes/_protected/pages/odata/index"

const Odata: React.FC = () => {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

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
  } = useOData<Person>()

  // 🔄 Sync context ←→ URL on mount
  useEffect(() => {
    setPage(searchParams.page ?? 1)
    setSortBy(searchParams.sortBy ?? "")
    setFilter(searchParams.filter ?? "")
    setSearch(searchParams.search ?? "")
  }, [searchParams, setPage, setSortBy, setFilter, setSearch])

  // 🔄 Navigate when page changes (context → URL)
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    navigate({
      search: {
        page: newPage,
        pageSize,
        sortBy,
        filter,
        search,
      },
    })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

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
  ]

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
      </div>

     <DataTable<Person>
  columns={columns}
  data={data ?? []}
  pagination={{
    page,
    pageSize,
    total,
    onPageChange: handlePageChange,
  }}
  onSortApply={(sortString) => {
    setSortBy(sortString)
    navigate({
      search: { page, pageSize, sortBy: sortString, filter, search },
    })
  }}
  onFilterApply={(filterString) => {
    setFilter(filterString)
    navigate({
      search: { page, pageSize, sortBy, filter: filterString, search },
    })
  }}
  onSearchApply={(searchString) => {
    setSearch(searchString)
    navigate({
      search: { page, pageSize, sortBy, filter, search: searchString },
    })
  }}
/>

    </div>
  )
}

export default Odata

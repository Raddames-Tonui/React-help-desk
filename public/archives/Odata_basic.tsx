// _protected/pages/odata/index.tsx
import React, { useState, useEffect } from 'react'
import { usePeople } from './usePeople'
import { Route } from '../../routes/_protected/pages/odata/index'

const Odata: React.FC = () => {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const page = searchParams.page ?? 1
  const pageSize = searchParams.pageSize ?? 5
  const sortBy = searchParams.sortBy ?? ''
  const filter = searchParams.filter ?? ''
  const freeSearch = searchParams.search ?? ''

  const { data, error, isLoading } = usePeople(
    page,
    pageSize,
    sortBy,
    filter,
    freeSearch
  )

  // 🔍 Debounced search state
  const [localSearch, setLocalSearch] = useState(freeSearch)
  useEffect(() => {
    const delay = setTimeout(() => {
      navigate({
        search: { page: 1, pageSize, sortBy, filter, search: localSearch },
      })
    }, 400) // 400ms debounce
    return () => clearTimeout(delay)
  }, [localSearch])

  // 🧹 Multi-filter state
  const [gender, setGender] = useState(filter.includes('Gender') ? filter.split("'")[1] : '')
  const [firstName, setFirstName] = useState('')
  const [city, setCity] = useState('')

  const applyFilters = () => {
    const filters: string[] = []
    if (gender) filters.push(`Gender eq '${gender}'`)
    if (firstName) filters.push(`startswith(FirstName,'${firstName}')`)
    if (city) filters.push(`AddressInfo/any(a:a/City/Name eq '${city}')`)
    const combined = filters.join(' and ')
    navigate({ search: { page: 1, pageSize, sortBy, filter: combined, search: freeSearch } })
  }

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage, pageSize, sortBy, filter, search: freeSearch } })
  }

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ search: { page: 1, pageSize: Number(e.target.value), sortBy, filter, search: freeSearch } })
  }

  const handleSort = (column: string) => {
    let newSort: string
    if (!sortBy.startsWith(column)) {
      newSort = `${column} asc`
    } else if (sortBy.endsWith('asc')) {
      newSort = `${column} desc`
    } else {
      newSort = ''
    }
    navigate({ search: { page: 1, pageSize, sortBy: newSort, filter, search: freeSearch } })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">OData People (Full Controls)</h1>

      {/* 🔍 Search */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Global search..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <select value={pageSize} onChange={handlePageSize} className="border px-3 py-1 rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* 🎛 Multi Filters */}
      <div className="flex items-center gap-4 mb-4">
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="border px-3 py-1 rounded">
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          placeholder="First name starts with..."
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="text"
          placeholder="City equals..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button onClick={applyFilters} className="px-3 py-1 border rounded bg-blue-500 text-white">
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            {['UserName', 'FirstName', 'LastName', 'Gender'].map((col) => (
              <th
                key={col}
                className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort(col)}
              >
                {col}
                {sortBy.startsWith(col) && (
                  <span className="ml-1">{sortBy.endsWith('asc') ? '⬆️' : '⬇️'}</span>
                )}
              </th>
            ))}
            <th className="border px-4 py-2">Emails</th>
            <th className="border px-4 py-2">City</th>
          </tr>
        </thead>
        <tbody>
          {data?.value.map((person) => (
            <tr key={person.UserName} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{person.UserName}</td>
              <td className="border px-4 py-2">{person.FirstName}</td>
              <td className="border px-4 py-2">{person.LastName}</td>
              <td className="border px-4 py-2">{person.Gender}</td>
              <td className="border px-4 py-2">{person.Emails?.join(', ')}</td>
              <td className="border px-4 py-2">
                {person.AddressInfo[0]?.City?.Name || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page}{' '}
          {data?.['@odata.count'] ? `of ${Math.ceil(data['@odata.count'] / pageSize)}` : ''}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={data?.['@odata.count'] ? page >= Math.ceil(data['@odata.count'] / pageSize) : false}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Odata

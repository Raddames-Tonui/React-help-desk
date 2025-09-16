import { useQuery } from '@tanstack/react-query'

export interface Address {
  Address: string
  City: {
    Name: string
    CountryRegion: string
    Region: string
  }
}

export interface Person {
  UserName: string
  FirstName: string
  LastName: string
  MiddleName: string | null
  Gender: string
  Age: number | null
  Emails: string[]
  FavoriteFeature: string
  Features: string[]
  AddressInfo: Address[]
  HomeAddress: string | null
}

interface OdataResponse<T> {
  value: T[]
  ['@odata.count']?: number
}



// ------ 3.Sorting, Filtering and Search support--------
const fetchPeople = async (
  page: number,
  pageSize: number,
  sortBy: string,
  filter: string,
  search: string
): Promise<ODataResponse<Person>> => {
  const skip = (page - 1) * pageSize

   // Build query params dynamically
  const params = new URLSearchParams({
    $top: pageSize.toString(),
    $skip: page.toString(),
    $count: 'true',
  })
  if (sortBy) params.set('$orderby', sortBy)
  if (filter) params.set('$filter', filter)
  if (search) params.set('$search', search)
    
  const url = `https://services.odata.org/TripPinRESTierService/(S(readwrite))/People?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch people')
  return res.json()
}

export function usePeople(
  page: number,
  pageSize: number,
  sortBy: string,
  filter: string,
  search: string
) {
  return useQuery<OdataResponse<Person>, Error>({
    queryKey: ['people', page, pageSize, sortBy, filter, search],
    queryFn: () => fetchPeople(page, pageSize, sortBy, filter, search),
    keepPreviousData: true
  })
}

/** 
 *  --------------- 2. PAGINATION ---------------------
const fetchPeople = async (page: number, pageSize: number, ): Promise<OdataResponse<Person>> => {
  const skip = (page - 1) * pageSize
  
  const url = `https://services.odata.org/TripPinRESTierService/(S(readwrite))/People?$top=${pageSize}&$skip=${skip}&$count=true`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch people')
  return res.json();
}

// Custom hook for paginated data
export function usePeople(page: number, pageSize: number) {
  return useQuery<ODataResponse<Person>, Error>({
    queryKey: ['people', page, pageSize], // cache key includes pagination
    queryFn: () => fetchPeople(page, pageSize),
    keepPreviousData: true, // smooth pagination (no flash empty)
  })
}


*/



/**
// ----------- 1. Basic fetch ---------------
const fetchPeople = async (): Promise<Person[]> => {
  const res = await fetch(
    'https://services.odata.org/TripPinRESTierService/(S(readwrite))/People'
  )
  if (!res.ok) {
    throw new Error('Failed to fetch people')
  }
  const data = await res.json()
  return data.value as Person[]
}

// Custom hook that wraps TanStack Query
export function usePeople() {
  return useQuery<Person[], Error>({
    queryKey: ['people'], // unique key for caching
    queryFn: fetchPeople, // async fetch function
  })
}
*/ 
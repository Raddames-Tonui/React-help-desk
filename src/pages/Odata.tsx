import React, { useReducer, useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import Table, { ColumnProps } from "../components/Table";
import Loader from "../components/Loader";
import Modalsort from "../components/Modalsort";
import ModalFilter from "../components/Modalfilter";

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.filter, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.sort, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, data: action.data, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}

const initialState = {
  filter: "",
  sort: "",
  page: 1,
  data: [],
  loading: false,
  error: null,
};

const baseUrl =
  "https://services.odata.org/TripPinRESTierService/(S(5jzojegqtqbpb0lmngwn0x0f))/People";

const Odata: React.FC = () => {
  const search = useSearch({ from: "/pages/odata/" }); 
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    filter: search.filter || "",
    sort: search.sort || "",
    page: search.page ? Number(search.page) : 1,
  });

  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isSortModalOpen, setSortModalOpen] = useState(false);

  const columns: ColumnProps<any>[] = [
    { id: "FirstName", caption: "First Name", size: 150, isFilterable: true, isSortable: true },
    { id: "LastName", caption: "Last Name", size: 150, isFilterable: true, isSortable: true },
    { id: "UserName", caption: "Username", size: 200, isFilterable: true, isSortable: true },
    { id: "Gender", caption: "Gender", size: 100, isFilterable: true, isSortable: true },
    {
      id: "Emails",
      caption: "Emails",
      size: 250,
      render: (row, value) => (Array.isArray(value) ? value.join(" ") : "—"),
      isFilterable: false,
      isSortable: false,
    },
    {
      id: "AddressInfo",
      caption: "City",
      size: 200,
      render: (row) => row.AddressInfo?.[0]?.City?.Name || "—",
      isFilterable: true,
      isSortable: false,
    },
  ];

  async function fetchData() {
    dispatch({ type: "FETCH_START" });

    const params = new URLSearchParams();
    params.set("$top", "10");
    params.set("$count", "true");
    params.set("$skip", String((state.page - 1) * 10));

    if (state.filter) params.set("$filter", state.filter);
    if (state.sort) params.set("$orderby", state.sort);

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", data: data.value });
    } catch (err: any) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }

  // Fetch whenever state changes
  useEffect(() => {
    fetchData();

    // sync URL params
    navigate({
      search: {
        filter: state.filter || undefined,
        sort: state.sort || undefined,
        page: state.page > 1 ? state.page : undefined,
      },
      replace: true, 
    });
  }, [state.filter, state.sort, state.page]);

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
        <div className="page-utils-buttons">
          <input type="search" />
          <button className="button" onClick={() => setFilterModalOpen(true)}>Filter</button>
          <button className="button" onClick={() => setSortModalOpen(true)}>Sort</button>
        </div>
      </div>

      <section className="table-section">
        {state.loading && <Loader />}
        {state.error && <p style={{ color: "red" }}>{state.error}</p>}
        {!state.loading && !state.error && <Table columns={columns} data={state.data} />}
      </section>

      <ModalFilter
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        columns={columns}
        initialFilter = {state.filter}
        onApply={(filterString) =>
          dispatch({ type: "SET_FILTER", filter: filterString })
        }
      />

      <Modalsort
        isOpen={isSortModalOpen}
        onClose={() => setSortModalOpen(false)}
        columns={columns}
        initialSort={state.sort}
        onApply={(sortString) =>
          dispatch({ type: "SET_SORT", sort: sortString })
        }
      />

      <div className="pagination">
        <button
          disabled={state.page === 1}
          onClick={() => dispatch({ type: "SET_PAGE", page: state.page - 1 })}
          className="pagination-btn prev-btn"
        >
          Prev
        </button>
        <span className="page-no">Page {state.page}</span>
        <button
          onClick={() => dispatch({ type: "SET_PAGE", page: state.page + 1 })}
          className="pagination-btn next-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Odata;

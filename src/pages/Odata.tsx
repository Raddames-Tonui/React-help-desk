import React, { useReducer, useEffect, useState } from "react";
import Table from "../components/Table"; 
import type { ColumnProps } from "../components/Table"; 
import "../css/Table.css";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModalOpen, setModalOpen] = useState(false);

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
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", data: data.value });
    } catch (err: any) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }

  useEffect(() => {
    fetchData();
  }, [state.filter, state.sort, state.page]);

  const columns: ColumnProps<any>[] = [
    { id: "FirstName", caption: "First Name", size: 150 },
    { id: "LastName", caption: "Last Name", size: 150 },
    { id: "UserName", caption: "Username", size: 200 },
    { id: "Gender", caption: "Gender", size: 100 },
    {
      id: "Emails",
      caption: "Emails",
      size: 250,
      render: (row, value) => (Array.isArray(value) ? value.join(" ") : "—"),
    },
    {
      id: "AddressInfo",
      caption: "City",
      size: 200,
      render: (row) => row.AddressInfo?.[0]?.City?.Name || "—",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
        <div className="page-utils">
          <button className="modal-close-btn" onClick={() => setModalOpen(true)}>
            Filter & Sort
          </button>
        </div>
      </div>

      <section className="table-section">
        {state.loading && (
          <div className="loader">
            <Loader />
          </div>
        )}
        {state.error && <p style={{ color: "red" }}>{state.error}</p>}

        {!state.loading && !state.error && (
          <Table columns={columns} data={state.data} />
        )}
      </section>

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

      {/* Modal for filter + sort */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Filter & Sort"
        body={
          <div className="filter-sort-body">
            <input
              type="text"
              placeholder="Filter by first name..."
              onChange={(e) =>
                dispatch({
                  type: "SET_FILTER",
                  filter: e.target.value
                    ? `contains(FirstName,'${e.target.value}')`
                    : "",
                })
              }
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />

            <select
              value={state.sort}
              onChange={(e) =>
                dispatch({ type: "SET_SORT", sort: e.target.value })
              }
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Sort...</option>
              <option value="FirstName asc">First Name (A-Z)</option>
              <option value="FirstName desc">First Name (Z-A)</option>
            </select>
          </div>
        }
        footer={
          <>
            <button className="cancel" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              Apply
            </button>
          </>
        }
      />
    </div>
  );
};

export default Odata;

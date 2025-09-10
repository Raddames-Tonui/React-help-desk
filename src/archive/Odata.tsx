import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "FETCH_SUCCESS":
      return { ...state, data: action.data, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.error, loading: false };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    default:
      return state;
  }


  const initialState = {
    filter: "",
    sort: "",
    page: 1,
    data: [],
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchData() {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(
        `/odata/People?$filter=${state.filter}&$orderby=${state.sort}&$skip=${(state.page - 1) * 10}&$top=10`
      );
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", data: data.value });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }
  
}
const Odata: React.FC = () => {
  return (
    <div>Odata</div>
  );
};

export default Odata;
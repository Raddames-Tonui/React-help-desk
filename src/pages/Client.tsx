import React, { useReducer } from "react";
import "../css/Form.css";
import Editor from "../components/Editor";

type State = {
  mainCategory: string;
  subCategory: string;
  problem: string;
  description: string;
  files: File[];
}

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: string }
  | { type: "SET_DESCRIPTION"; value: string }
  | { type: "SET_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "RESET" };

const initialState: State = {
  mainCategory: "",
  subCategory: "",
  problem: "",
  description: "",
  files: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_DESCRIPTION":
      return { ...state, description: action.value };
    case "SET_FILES":
      return { ...state, files: action.files };
    case "REMOVE_FILE":
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Client: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      dispatch({ type: "SET_FILES", files: selectedFiles });
    }
  };

  const removefiles = (index: number) => {
    dispatch({ type: "REMOVE_FILE", index });
  }

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file); 
  });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const filesBase64 = await Promise.all(
    state.files.map(async (file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      content: await fileToBase64(file),
    }))
  );

  const newTicket = {
    ...state,
    files: filesBase64,
    ticket_id: Date.now(), 
    date_requested: new Date().toISOString(),
  };

  const saved = localStorage.getItem("ticketForm");
  let tickets = saved ? JSON.parse(saved) : [];

  if (!Array.isArray(tickets)) tickets = [tickets];

  tickets.push(newTicket);

  localStorage.setItem("ticketForm", JSON.stringify(tickets));

  console.log("Saved to localStorage:", newTicket);

  dispatch({ type: "RESET" });
};

    
    
  return (
    <section>
      <div className="page-header">
        <h3>Create Ticket</h3>
      </div>

      <div className="form-wrapper">
        <form className="form" id="ticket-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="main-category">Main Category</label>
            <input type="text" id="main-category" name="main-category"
              value={state.mainCategory}
              onChange={e => dispatch({type: "SET_FIELD", field: "mainCategory", value: e.target.value})}
              required />
          </div>

          <div className="form-group">
            <label htmlFor="sub-category">Sub Category</label>
            <input type="text" id="sub-category" name="sub-category"
              value={state.subCategory}
              onChange={e => dispatch({type: "SET_FIELD", field: "subCategory", value: e.target.value})}
              required />
          </div>

          <div className="form-group">
            <label htmlFor="problem">Problem/Issue</label>
            <input type="text" id="problem" name="problem"
              value={state.problem}
              onChange={e=> dispatch({type: "SET_FIELD", field: "problem", value: e.target.value})}
              required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Editor
              name="description"
              value={state.description}
              onChange={(html) => dispatch({type: "SET_FIELD", field: "description", value: html}) } />
            <textarea
              style={{ display: "none" }}
              value={state.description}
              onChange={e => dispatch({type: "SET_DESCRIPTION", value: e.target.value})}
              readOnly></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <div>
              <input type="file"
                id="file-upload"
                style={{ display: "none" }}
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="custom-file-label">Select File(s)</label>
              <p className="file-note">
                Allowed file extensions: <strong>.jpg, .jpeg, .pdf, .png </strong> <br />
                Maximum File Size: <strong> 2MB </strong> <br />
                Maximum No. of File: <strong> 5 </strong>
              </p>
              <div className="file-list">
                {state.files.map((file, index) => (
                  <div key={index} className="file-item" >
                    <span className="file-icon">
                      <svg width="16" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.99931 15.4883C2.24908 15.4883 1.52877 15.2076 0.95469 14.6881C-0.318181 13.5336 -0.318181 11.6558 0.954396 10.5021L10.8796 0.973574C12.4282 -0.428676 14.8003 -0.302676 16.5314 1.26432C17.307 1.96682 17.7423 2.97957 17.726 4.04407C17.7096 5.09734 17.2545 6.10532 16.4766 6.80982L8.97543 14.0293C8.76665 14.2316 8.41656 14.2408 8.19369 14.0511C7.97136 13.8611 7.96058 13.5441 8.17019 13.3426L15.6827 6.11207C16.2703 5.57982 16.6074 4.82481 16.6198 4.03006C16.6323 3.23482 16.3146 2.48506 15.7493 1.97281C14.6874 1.01081 12.9586 0.507058 11.6732 1.67181L1.74828 11.2003C0.894907 11.9738 0.895184 13.2161 1.73722 13.9793C2.13209 14.3365 2.60081 14.5105 3.09995 14.4833C3.59383 14.456 4.10154 14.227 4.52961 13.839L12.4268 6.24003C12.713 5.98078 13.2881 5.34528 12.7027 4.81478C12.3712 4.51453 12.1383 4.53303 12.0618 4.53878C11.843 4.55628 11.5875 4.69303 11.3223 4.93353L5.37828 10.6488C5.16839 10.8505 4.81803 10.8603 4.59651 10.67C4.3739 10.4805 4.36367 10.163 4.57301 9.96203L10.5279 4.23603C10.996 3.81078 11.4747 3.58028 11.9619 3.54078C12.3422 3.51026 12.9077 3.58353 13.4845 4.10653C14.3407 4.88201 14.2342 6.01953 13.2204 6.93803L5.32327 14.5365C4.69278 15.1085 3.93147 15.4408 3.1677 15.4832C3.11156 15.4867 3.05542 15.4882 2.99929 15.4882L2.99931 15.4883Z" fill="#1C7ED6"/>
                      </svg>
                    </span>
                    <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">
                      {file.name}
                    </a>
                    <span className="remove-file" onClick={() => removefiles(index)}>
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.489201 0.46967C0.782094 0.176777 1.25697 0.176777 1.54986 0.46967L5.01953 3.93934L8.4892 0.46967C8.78209 0.176777 9.25697 0.176777 9.54986 0.46967C9.84275 0.762563 9.84275 1.23744 9.54986 1.53033L6.08019 5L9.54986 8.46967C9.84275 8.76256 9.84275 9.23744 9.54986 9.53033C9.25697 9.82322 8.78209 9.82322 8.4892 9.53033L5.01953 6.06066L1.54986 9.53033C1.25697 9.82322 0.782094 9.82322 0.489201 9.53033C0.196308 9.23744 0.196308 8.76256 0.489201 8.46967L3.95887 5L0.489201 1.53033C0.196308 1.23744 0.196308 0.762563 0.489201 0.46967Z" fill="#C92A2A"/>
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary" form="ticket-form">Create</button>
        <button type="submit" className="secondary" form="ticket-form">Create and add another</button>
        <button type="button" className="cancel" form="ticket-form"
          onClick={() => dispatch({type: "RESET"})}>Cancel</button>
      </div>
    </section>
  );
};

export default Client;

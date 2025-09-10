import React, { useState } from "react";
import "../css/client.css";
import "../css/Form.css";
import Editor from "./Editor";

const Client: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const removefiles = (index: number) => {
    setFiles((prevFile) => prevFile.filter((_, i) => i !== index));
  };

  return (
    <section>
      <div className="tickets-page-header">
        <h3>Create Ticket</h3>
      </div>

      <div className="form-wrapper">
        <form className="form" id="ticket-form">
          <div className="form-group">
            <label htmlFor="main-category">Main Category</label>
            <input type="text" id="main-category" name="main-category" required />
          </div>

          <div className="form-group">
            <label htmlFor="sub-category">Sub Category</label>
            <input type="text" id="sub-category" name="sub-category" required />
          </div>

          <div className="form-group">
            <label htmlFor="problem">Problem/Issue</label>
            <input type="text" id="problem" name="problem" required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Editor name="description" placeholder="Enter description..." />
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <div>
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="custom-file-label">
                Select File(s)
              </label>
              <p className="file-note">
                Allowed file extensions: <strong>.jpg, .jpeg, .pdf, .png </strong> <br />
                Maximum File Size: <strong> 2MB </strong> <br />
                Maximum No. of File: <strong> 5 </strong>
              </p>
              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-icon">📎</span>
                    <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">
                      {file.name}
                    </a>
                    <span className="remove-file" onClick={() => removefiles(index)}>✕</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary" form="ticket-form">
          Create
        </button>
        <button type="submit" className="secondary" form="ticket-form">
          Create and add another
        </button>
        <button type="reset" className="cancel" form="ticket-form">
          Cancel
        </button>
      </div>
    </section>
  );
};

export default Client;

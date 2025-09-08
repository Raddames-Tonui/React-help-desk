import React from "react";
import "../css/client.css";
import "../css/Form.css";

const Client: React.FC = () => {
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
            <div className="description-field">
              <div className="text-editor-toolbar">
                <button type="button"><b>B</b></button>
                <button type="button"><i>I</i></button>
                <button type="button">U</button>
                <span className="separator"></span>
                <button type="button">H1</button>
                <button type="button">H2</button>
                <button type="button">H3</button>
                <button type="button">H4</button>
                <span className="separator"></span>
                <button type="button">•</button>
                <button type="button">1.</button>
                <span className="separator"></span>
                <button type="button">⎘</button> 
                <button type="button">⤴</button>
                <button type="button">“ ”</button>
                <button type="button">≡</button>
              </div>
            </div>
            <textarea name="description" id="description" rows={8} required></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <div>
              <input type="file" id="file-upload" style={{ display: "none" }} multiple />
              <label htmlFor="file-upload" className="custom-file-label">Select File(s)</label>
              <p className="file-note">
                Allowed file extensions: <strong>.jpg, .jpeg, .pdf, .png </strong> <br />
                Maximum File Size: <strong> 2MB </strong> <br />
                Maximum No. of File: <strong> 5 </strong>
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="form-actions">
        {/* Notice: we use `form="ticket-form"` not `id` */}
        <button type="submit" className="primary" form="ticket-form">Create</button>
        <button type="submit" className="secondary" form="ticket-form">Create and add another</button>
        <button type="reset" className="cancel" form="ticket-form">Cancel</button>
      </div>
    </section>
  );
};

export default Client;

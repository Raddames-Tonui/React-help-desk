import React from "react";
import "../css/vendor.css"


const Vendor: React.FC = () => {
  return (
    <section className="tickets-page">
      <nav className="tickets-nav">
        <div className="tickets-page-header">
            <h3>All Tickets</h3>
        </div>
         <ul>
          <li className="all active">
            <span className="label">All</span>
            <span className="count">0</span>
          </li>
          <li className="open">
            <span className="label">Open</span>
            <span className="count">0</span>
          </li>
          <li className="progress">
            <span className="label">In Progress</span>
            <span className="count">0</span>
          </li>
          <li className="resolved">
            <span className="label">Resolved</span>
            <span className="count">0</span>
          </li>
          <li className="closed">
            <span className="label">Closed</span>
            <span className="count">0</span>
          </li>
          <li className="dropped">
            <span className="label">Dropped</span>
            <span className="count">0</span>
          </li>
          <li className="hold">
            <span className="label">On Hold</span>
            <span className="count">0</span>
          </li>
    </ul>
      </nav>

      <div className="tickets-table">
        <div className="tickets-page-header">
          <h3>All Tickets</h3>
          <button >Add Ticket</button>
        </div>
      </div>
    </section>
  );
};

export default Vendor;

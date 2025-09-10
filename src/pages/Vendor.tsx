import React from "react";
import "../css/vendor.css"
import Table from "../components/Table";
import type { ColumnProps } from "../components/Table";


interface Ticket {
  ticket_id: number;
  ticket_subject: string;
  ticket_status: string;
  source: string;
  date_requested: string;
}

const tickets: Ticket[] = [
  {
    ticket_id: 1,
    ticket_subject: "Addition of Guarantors to Loan Module",
    ticket_status: "Open",
    source: "Email",
    date_requested: "2024-05-06 12:00:00",
  },
  {
    ticket_id: 2,
    ticket_subject: "Reset Password",
    ticket_status: "Resolved",
    source: "Email",
    date_requested: "2024-05-07 12:00:00",
  },
  {
    ticket_id: 3,
    ticket_subject: " Password",
    ticket_status: "Dropped",
    source: "Email",
    date_requested: "2024-05-07 12:00:00",
  },
  {
    ticket_id: 4,
    ticket_subject: "Reset Password",
    ticket_status: "Resolved",
    source: "Email",
    date_requested: "2024-05-07 12:00:00",
  },
  {
    ticket_id: 5,
    ticket_subject: "Portal Rights Requisition",
    ticket_status: "Closed",
    source: "Email",
    date_requested: "2024-05-08 12:00:00",
  },
  {
    ticket_id: 6,
    ticket_subject: "Addition of SHA Insurance",
    ticket_status: "In Progress",
    source: "Help Desk System",
    date_requested: "2024-05-10 12:00:00",
  },
];

const columns: ColumnProps<Ticket>[] = [
  { id: "ticket_id", caption: "Ticket ID", size: 80 },
  {
    id: "ticket_subject",
    caption: "Ticket Subject",
    size: 300,
    render: (row, value) => (
      <a href={`/tickets/${row.ticket_id}`} style={{ color: "#144D5A", textDecoration: "underline" }}>
        {value}
      </a>
    ),
  },
  {
    id: "ticket_status",
    caption: "Ticket Status",
    size: 150,
    render: (row, value) => {
      const status = String(value);
      const color =
        status === "Open"
          ? "#FD7E14"
          : status === "In Progress"
          ? "#1C7ED6"
          : status === "Resolved"
          ? "#37B24D"
          : status === "Closed"
          ? "#0CA678"
          : status === "Dropped"
          ? "#F03E3E"
          : status === "Resolved"
          ? "#37B24D"
          : "gray";
      return <span style={{ color }}>{status}</span>;
    },
  },
  { id: "source", caption: "Source", size: 200 },
  { id: "date_requested", caption: "Date Requested", size: 200 },
];




const Vendor: React.FC = () => {
  return (
    <section className="tickets-page">
      <nav className="tickets-nav">
        <div className="page-header">
            <h3>All Tickets</h3>
        </div>
         <ul>
          <li className="all active">
            <span className="label">All</span>
            <span className="count">{tickets.length}</span>
          </li>
          <li className="open">
            <span className="label">Open</span>
            <span className="count">
              {tickets.filter((t) => t.ticket_status === "Open").length}
            </span>
          </li>
          <li className="progress">
            <span className="label">In Progress</span>
            <span className="count">
              {tickets.filter((t) => t.ticket_status == "In Progress").length}
            </span>
          </li>
          <li className="resolved">
            <span className="label">Resolved</span>
            <span className="count">
              {tickets.filter((t) =>t.ticket_status === "Resolved").length}
            </span>
          </li>
          <li className="closed">
            <span className="label">Closed</span>
            <span className="count">
                {tickets.filter((t) =>t.ticket_status === "Closed").length}
            </span>
          </li>
          <li className="dropped">
            <span className="label">Dropped</span>
            <span className="count">
               {tickets.filter((t) =>t.ticket_status === "Dropped").length}
            </span>
          </li>
          <li className="hold">
            <span className="label">On Hold</span>
            <span className="count">
               {tickets.filter((t) =>t.ticket_status === "On Hold").length}
            </span>
          </li>
    </ul>
      </nav>

      <div className="tickets-table">
        <div className="page-header">
          <h3>All Tickets</h3>
          <button >Add Ticket</button>
        </div>
        
        <div className="table-wrapper">
          <Table columns={columns} data={tickets}/>
        </div>
      </div>
    </section>
  );
};

export default Vendor;

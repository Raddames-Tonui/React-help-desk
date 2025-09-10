import React from "react";
import "../css/vendor.css";
import Table, { ColumnDef } from "../components/Table";

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
    ticket_status: "Closed",
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
    ticket_subject: "Portal Rights Requisition",
    ticket_status: "Open",
    source: "Email",
    date_requested: "2024-05-08 12:00:00",
  },
  {
    ticket_id: 4,
    ticket_subject: "Addition of SHA Insurance",
    ticket_status: "In Progress",
    source: "Help Desk System",
    date_requested: "2024-05-10 12:00:00",
  },
];


const ticketColumns: ColumnDef<Ticket>[] = [
  {
    accessor: "ticket_id",
    header: "Ticket ID",
    width: 80,
    align: "right",
    sortable: true,
  },
  {
    accessor: "ticket_subject",
    header: "Subject",
    width: 300,
    render: ({ value }) => (
      <a href="#" style={{ color: "#144D5A", textDecoration: "underline" }}>
        {String(value)}
      </a>
    ),
  },
  {
    accessor: "ticket_status",
    header: "Status",
    width: 150,
    render: ({ value }) => {
      const status = String(value);
      const color =
        status === "Open"
          ? "green"
          : status === "In Progress"
          ? "orange"
          : status === "Resolved"
          ? "blue"
          : "gray";
      return <span style={{ color }}>{status}</span>;
    },
  },
  {
    accessor: "source",
    header: "Source",
    width: 200,
  },
  {
    accessor: "date_requested",
    header: "Date Requested",
    width: 200,
    dataType: "date",
  },
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
              {tickets.filter((t) => t.ticket_status === "In Progress").length}
            </span>
          </li>
          <li className="resolved">
            <span className="label">Resolved</span>
            <span className="count">
              {tickets.filter((t) => t.ticket_status === "Resolved").length}
            </span>
          </li>
          <li className="closed">
            <span className="label">Closed</span>
            <span className="count">
              {tickets.filter((t) => t.ticket_status === "Closed").length}
            </span>
          </li>
        </ul>
      </nav>

      <div className="tickets-table">
        <div className="page-header">
          <h3>All Tickets</h3>
          <button>Add Ticket</button>
        </div>

        <div className="table-wrapper">
          <Table<Ticket>
            data={tickets}
            columns={ticketColumns}
            rowKey={(row) => row.ticket_id}
          />
        </div>
      </div>
    </section>
  );
};

export default Vendor;

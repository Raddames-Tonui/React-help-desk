import React, { useEffect, useState } from "react";
import "../css/vendor.css";
import Table from "../components/Table";
import type { ColumnProps } from "../components/Table";
import { useNavigate } from "@tanstack/react-router";

interface Ticket {
  ticket_id?: number;
  mainCategory: string;
  subCategory: string;
  problem: string;
  description: string;
  files: { name: string; size: number; type: string; content?: string }[];
  date_requested?: string;
  ticket_status?: string;
  source?: string;
}

const Vendor2: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("ticketForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      setTickets(arr);
    }
  }, []);

const columns: ColumnProps<Ticket>[] = [
  {
    id: "mainCategory",
    caption: "Main Category",
    size: 150,
    render: (row, value) => {
      const id = row.ticket_id ?? tickets.indexOf(row) + 1
      return (
        <button
          onClick={() =>
            navigate({ to: "/pages/vendor/$id", params: { id: String(id) } })
          }
          style={{
            background: "none",
            border: "none",
            color: "#1C7ED6",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {String(value)}
        </button>
      )
    },
  },
  { id: "subCategory", caption: "Sub Category", size: 150 },
  { id: "problem", caption: "Problem", size: 200 },
  {
    id: "description",
    caption: "Description",
    size: 250,
    render: (row, value) => (
      <div dangerouslySetInnerHTML={{ __html: String(value) }} />
    ),
  },
  {
    id: "files",
    caption: "Files",
    size: 250,
    hide: true,
  },
]


  return (
    <section className="tickets-page">
      <div className="tickets-table">
        <div className="page-header">
          <h3>Submitted Tickets</h3>
        </div>

        <div className="table-wrapper">
          {tickets.length > 0 ? (
            <Table
              columns={columns}
              data={tickets}
            />
          ) : (
            <p>No tickets found. Submit one via the form.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Vendor2;

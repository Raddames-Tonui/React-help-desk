import React from "react";
import "../css/Table.css";

interface ColumnProps {
  id: string;
  caption: string;
  size: number;
  align: "left" | "right";
  hide: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  data_type: boolean | string;
  render?: (data: any) => React.ReactNode;
}

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
    ticket_subject: "Portal Rights Requisition",
    ticket_status: "Closed",
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

const Table: React.FC = () => {
  const columnsMap: Record<string, Partial<ColumnProps>> = {
    ticket_id: {
      caption: "Ticket ID",
      size: 80,
    },
    ticket_subject: {
      caption: "Ticket Subject",
      render: (row) => (
        <a href="#" style={{ color: "blue", textDecoration: "underline" }}>
          {row.ticket_subject}
        </a>
      ),
      size: 300,
    },
    ticket_status: {
      caption: "Ticket Status",
      size: 150,
    },
    source: {
      caption: "Source",
      size: 200,
    },
    date_requested: {
      caption: "Date Requested",
      size: 200,
    },
  };

  const columns: ColumnProps[] = Object.entries(columnsMap).map(
    ([columnId, columnDetails]) => {
      return {
        id: columnId,
        caption:
          columnDetails?.caption ??
          columnId
            .toLowerCase()
            .split("_")
            .map((s) => s.toUpperCase())
            .join(" "),
        size: columnDetails?.size ?? 100,
        align: columnDetails?.align ?? "left",
        hide: columnDetails?.hide ?? false,
        isSortable: columnDetails?.isSortable ?? true,
        isFilterable: columnDetails?.isFilterable ?? true,
        data_type: columnDetails?.data_type ?? "text",
        render: columnDetails?.render,
      };
    }
  );

  return (
    // <table style={{ borderCollapse: "collapse", width: "100%" }}>
    <table>
      <thead>
        <tr>
          {columns.map((col) =>
            !col.hide ? (
              <th
                key={col.id}
                style={{
                  textAlign: col.align,
                  width: col.size,
                  border: "1px solid #ddd",
                  padding: "8px",
                  background: "#f9f9f9",
                }}
              >
                {col.caption}
              </th>
            ) : null
          )}
        </tr>
      </thead>
      <tbody>
        {tickets.map((row) => (
          <tr key={row.ticket_id}>
            {columns.map((col) =>
              !col.hide ? (
                <td
                  key={col.id}
                  style={{
                    textAlign: col.align,
                    width: col.size,
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {col.render ? col.render(row) : (row as any)[col.id]}
                </td>
              ) : null
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

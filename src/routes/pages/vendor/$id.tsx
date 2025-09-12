import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/pages/vendor/$id')({
  component: VendorDetail,
})

function VendorDetail() {
  const { id } = Route.useParams()
  const saved = localStorage.getItem("ticketForm")
  let ticket = null

  if (saved) {
    const parsed = JSON.parse(saved)
    const arr = Array.isArray(parsed) ? parsed : [parsed]
    ticket = arr.find((t: any, index: number) => 
      String(t.ticket_id ?? index + 1) === id
    )
  }

  if (!ticket) {
    return <p>No ticket found for ID {id}</p>
  }

  return (
    <section className="ticket-detail">
      <h2>Ticket #{id}</h2>
      <p><strong>Main Category:</strong> {ticket.mainCategory}</p>
      <p><strong>Sub Category:</strong> {ticket.subCategory}</p>
      <p><strong>Problem:</strong> {ticket.problem}</p>
      <div>
        <strong>Description:</strong>
        <div dangerouslySetInnerHTML={{ __html: ticket.description }} />
      </div>
      <div>
  <strong>Files:</strong>
  {ticket.files?.length ? (
    <ul>
      {ticket.files.map((f: any, i: number) => (
        <li key={i} style={{ marginBottom: "1rem" }}>
          <p>
            {f.name} ({(f.size / 1024).toFixed(1)} KB)
          </p>

          {/* Image preview */}
          {f.type.startsWith("image/") && (
            <img
              src={f.content}
              alt={f.name}
              style={{ maxWidth: "200px", maxHeight: "200px", display: "block" }}
            />
          )}

          {/* PDF preview */}
          {f.type === "application/pdf" && (
            <iframe
              src={f.content}
              style={{ width: "400px", height: "300px", border: "1px solid #ccc" }}
              title={f.name}
            />
          )}

          {/* Other file types as download link */}
          {!f.type.startsWith("image/") && f.type !== "application/pdf" && (
            <a href={f.content} download={f.name}>
              Download {f.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <span>None</span>
  )}
</div>

    </section>
  )
}

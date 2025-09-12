import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import '@/css/VendorDetail.css';

export const Route = createFileRoute('/pages/vendor/$id')({
  component: VendorDetail,
});

function VendorDetail() {
  const { id } = Route.useParams();
  const saved = localStorage.getItem("ticketForm");
  let ticket = null;

  if (saved) {
    const parsed = JSON.parse(saved);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    ticket = arr.find((t: any, index: number) => 
      String(t.ticket_id ?? index + 1) === id
    );
  }

  const [selectedFile, setSelectedFile] = useState(ticket?.files?.[0] || null);

  if (!ticket) return <p>No ticket found for ID {id}</p>;

  return (
    <section className="ticket-detail">
      <div className="ticket-info">
        <div>
          <h2>Ticket #{id}</h2>
          <p><strong>Main Category:</strong> {ticket.mainCategory}</p>
          <p><strong>Sub Category:</strong> {ticket.subCategory}</p>
          <p><strong>Problem:</strong> {ticket.problem}</p>
          <div>
            <strong>Description:</strong>
            <div dangerouslySetInnerHTML={{ __html: ticket.description }} />
          </div>
        </div>

        {ticket.files?.length > 0 && (
          <div className="file-list">
            <ul>
              {ticket.files.map((f: any, i: number) => (
                <li key={i} onClick={() => setSelectedFile(f)}>
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="ticket-preview">
        <div className="preview-area">
          {selectedFile ? (
            <>
              {selectedFile.type.startsWith("image/") && (
                <img src={selectedFile.content} alt={selectedFile.name} />
              )}
              {selectedFile.type === "application/pdf" && (
                <iframe src={selectedFile.content} title={selectedFile.name}></iframe>
              )}
              {!selectedFile.type.startsWith("image/") && selectedFile.type !== "application/pdf" && (
                <a href={selectedFile.content} download={selectedFile.name}>
                  Download {selectedFile.name}
                </a>
              )}
            </>
          ) : (
            <p>No file selected</p>
          )}
        </div>
      </div>
    </section>
  );
}

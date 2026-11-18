import React from 'react';
import './AuditLog.css';

export default function AuditLog() {
  // Mock data transcribed from the screenshot
  const auditData = [
    { timestamp: '?', user: 'Tolu', action: 'He did a thing', record: '?', detail: '?' },
    
  ];

  return (
    <div className="audit-container p-4">
      
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
        <div style={{ maxWidth: '900px' }}>
          <h2 className="fw-bold mb-1">Audit Log</h2>
          <p className="text-muted mb-0">
            Every status change, decision, comment, and document upload is logged with timestamp and user (FR19). Personal information access is recorded for PIPEDA compliance.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-muted">Timestamp</th>
                  <th className="text-uppercase text-muted">User</th>
                  <th className="text-uppercase text-muted">Action</th>
                  <th className="text-uppercase text-muted">Record</th>
                  <th className="text-uppercase text-muted">Detail</th>
                </tr>
              </thead>
              <tbody>
                {auditData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-semibold timestamp-col">{row.timestamp}</td>
                    <td className="fw-semibold">{row.user}</td>
                    <td className="text-muted">{row.action}</td>
                    <td className="fw-semibold record-col">{row.record}</td>
                    <td className="text-muted">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
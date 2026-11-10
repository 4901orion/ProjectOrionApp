import React from 'react';
import './Dashboard.css';


export default function Dashboard(){
    //This is where the stats data will be stored. In this array
    const stats = [
        {
            title: 'Awaiting final decision',
            value: '2',
            details: 'Stuff....',
            isWarning: true
        },
        {
            title: 'Awaiting final decision',
            value: '2',
            details: 'Stuff....',
            isWarning: true
        },
    ];

    //This is where table data will be stored. In this array
    const tableData = [
        {
            protocol: 'Stuff',
            pi: 'Dr. A. Chen',
            path: 'Expedited',
            recommendation: 'Revision Required',
        },
        {
            protocol: 'Stuff',
            pi: 'Dr. A. Chen',
            path: 'Expedited',
            recommendation: 'Revision Required',
        },
    ];

    return (
    <div className="dashboard-container p-4">
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Dashboard</h2>
        <p className="text-muted">
          Review recommendations, resolve disagreements, and issue final decisions.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
            <div className="card h-100 shadow-sm border-0 stat-card">
              <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="stat-title text-uppercase text-muted fw-bold mb-2">
                  {stat.title}
                </h6>
                <div>
                  <h2 className="stat-value fw-bold mb-2">{stat.value}</h2>
                  <p className={`stat-details mb-0 ${stat.isWarning ? 'text-warning-dark' : 'text-muted'}`}>
                    {stat.details}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="info-banner d-flex align-items-center p-3 mb-4 rounded">
        <span className="me-3 fs-5">🚩</span>
        <span className="text-dark">
          Reviewer flags let reviewers raise a question directly with you — no email or Teams message required.
        </span>
      </div>

      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <h5 className="fw-bold p-4 mb-0 border-bottom">Reviews ready for decision</h5>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th className="text-uppercase text-muted">Protocol</th>
                  <th className="text-uppercase text-muted">PI</th>
                  <th className="text-uppercase text-muted">Path</th>
                  <th className="text-uppercase text-muted">Recommendations</th>
                  <th className="text-end"></th> {/* Empty header for button column */}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{row.protocol}</td>
                    <td>{row.pi}</td>
                    <td>{row.path}</td>
                    <td className="text-muted">{row.recommendation}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-primary btn-sm rounded-pill px-4 decide-btn">
                        Decide
                      </button>
                    </td>
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
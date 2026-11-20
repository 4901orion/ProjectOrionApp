import React from 'react';
import './ReportMetrics.css';

export default function ReportsMetrics() {
  const topStats = [
    { title: 'TOTAL SUBMISSIONS', value: '?', sub: '?' },
    { title: 'MEDIAN REVIEW TIME', value: '?', sub: '?' },
    { title: 'APPROVAL RATE', value: '?', sub: '?' },
    { title: 'AMENDMENTS', value: '?', sub: '?' },
  ];

  const applicationsByMonth = [
    { month: 'Sep 2026', value: 7, max: 7 },
    { month: 'Aug 2026', value: 5, max: 7 },
    { month: 'Jul 2026', value: 2, max: 7 },
    { month: 'Jun 2026', value: 4, max: 7 },
    { month: 'May 2026', value: 6, max: 7 },
    { month: 'Apr 2026', value: 3, max: 7 },
  ];

  const reviewTurnaround = [
  ];

  const timeStages = [
  ];

  const upcomingRenewals = [
  ];

  return (
    <div className="reports-container p-4">
      
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Reports & Metrics</h2>
          <p className="text-muted mb-0">
            Find bottlenecks across the review pipeline. All figures filterable by time period.
          </p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm custom-select" defaultValue="12">
            <option value="12">Last 12 months</option>
            <option value="6">Last 6 months</option>
            <option value="3">Last 3 months</option>
          </select>
          <button className="btn btn-outline-secondary btn-sm px-3 export-btn">Export</button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="row g-3 mb-4">
        {topStats.map((stat, idx) => (
          <div className="col-12 col-md-6 col-xl-3" key={idx}>
            <div className="card h-100 shadow-sm border-0 stat-card">
              <div className="card-body">
                <h6 className="text-muted fw-bold mb-2 stat-title">{stat.title}</h6>
                <h2 className="fw-bold mb-1">{stat.value}</h2>
                <p className="text-muted small mb-0">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Charts */}
      <div className="row g-4 mb-4">
        
        {/* Applications by month */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Applications by month</h5>
              <div className="d-flex flex-column gap-3">
                {applicationsByMonth.map((item, idx) => (
                  <div className="d-flex align-items-center" key={idx}>
                    <div className="chart-label text-muted">{item.month}</div>
                    <div className="progress-track flex-grow-1 mx-3">
                      <div 
                        className="progress-fill bg-navy" 
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <div className="chart-value fw-bold text-end">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Average review turnaround */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="fw-bold mb-4">Average review turnaround by reviewer</h5>
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {reviewTurnaround.map((item, idx) => (
                  <div className="d-flex align-items-center" key={idx}>
                    <div className="chart-label text-muted text-truncate" style={{ width: '100px' }}>{item.name}</div>
                    <div className="progress-track flex-grow-1 mx-3">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(item.days / item.max) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="chart-value fw-bold text-end">{item.days}</div>
                  </div>
                ))}
              </div>
              <p className="text-muted small mt-4 mb-0">
                Days from assignment to recommendation. Values above 20 days are flagged.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Stages & Table */}
      <div className="row g-4">
        
        {/* Time with applicant vs. board */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="fw-bold mb-4">Time with applicant vs. board</h5>
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {timeStages.map((item, idx) => (
                  <div className="d-flex align-items-center" key={idx}>
                    <div className="chart-label text-muted text-truncate" style={{ width: '140px' }}>{item.stage}</div>
                    <div className="progress-track flex-grow-1 mx-3">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(item.days / item.max) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="chart-value fw-bold text-end">{item.days}</div>
                  </div>
                ))}
              </div>
              <p className="text-muted small mt-4 mb-0">
                Share of total cycle time. The largest block is time spent waiting on applicants.
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming renewals Table */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Upcoming renewals</h5>
              <div className="table-responsive">
                <table className="table custom-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="text-muted text-uppercase">Protocol</th>
                      <th className="text-muted text-uppercase">PI</th>
                      <th className="text-muted text-uppercase">Expires</th>
                      <th className="text-muted text-uppercase text-end">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingRenewals.map((row, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{row.protocol}</td>
                        <td>{row.pi}</td>
                        <td className="text-muted">{row.expires}</td>
                        <td className="text-end">
                          <span className={`days-badge ${row.alert ? 'alert-bg' : 'normal-bg'}`}>
                            {row.days}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
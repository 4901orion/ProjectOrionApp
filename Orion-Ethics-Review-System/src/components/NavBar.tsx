import React from "react";
import { NavLink } from "react-router-dom";
import "../NavBar.css";

function NavBar() {
  return (
    <>
      <div className="d-flex align-items-start">
        {/* 1. Sidebar Wrapper (Wraps the heading and the menu) */}
        <div className="sidebar-container me-4">
          <div
            className="nav flex-column custom-nav"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Dashboard
            </NavLink>

            <NavLink
              to="/final-decisions"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Final Decisions
            </NavLink>

            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              All Applications
            </NavLink>

            <NavLink
              to="/form-builder"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Form Builder
            </NavLink>

            <NavLink
              to="/reports-metrics"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              Reports & Metrics
            </NavLink>

            <NavLink
              to="/audit-log"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? "active" : ""}`
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Audit Log
            </NavLink>
          </div>
        </div>{" "}
        {/* <--- CLOSES SIDEBAR CONTAINER */}
        {/* 2. Content Area */}
        <div className="tab-content flex-grow-1" id="v-pills-tabContent">
          <div
            className="tab-pane show active"
            id="v-pills-dashboard"
            role="tabpanel"
            aria-labelledby="v-pills-dashboard-tab"
            tabIndex={0}
          ></div>
          <div
            className="tab-pane"
            id="v-pills-finalDecisions"
            role="tabpanel"
            aria-labelledby="v-pills-finalDecisions-tab"
            tabIndex={0}
          ></div>
          <div
            className="tab-pane"
            id="v-pills-allApplications"
            role="tabpanel"
            aria-labelledby="v-pills-allApplications-tab"
            tabIndex={0}
          ></div>
          <div
            className="tab-pane"
            id="v-pills-formBuilder"
            role="tabpanel"
            aria-labelledby="v-pills-formBuilder-tab"
            tabIndex={0}
          ></div>
          <div
            className="tab-pane"
            id="v-pills-reports_metrics"
            role="tabpanel"
            aria-labelledby="v-pills-reports_metrics-tab"
            tabIndex={0}
          ></div>
          <div
            className="tab-pane"
            id="v-pills-auditLog"
            role="tabpanel"
            aria-labelledby="v-pills-auditLog-tab"
            tabIndex={0}
          ></div>
        </div>
      </div>{" "}
      {/* <--- CLOSES D-FLEX WRAPPER */}
    </>
  );
}

export default NavBar;

import React from "react";
import uwLogo from "../assets/uw-logo.png";
import "../Header.css";
// Ignore the red line under the import statement.

function Header() {
  return (
    <header className="app-header">
      {/* Left Side: Branding */}
      <div className="brand-section">
        <img src={uwLogo} alt="UWinnipeg Logo" className="logo-img" />

        <div className="brand-text">
          <h1>Orion Ethics Review System</h1>
        </div>
      </div>

      {/* Right Side: User & Messages */}
      <div className="user-section">
        {/* Messages Icon */}
        <div className="message-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="badge">3</span>
        </div>

        {/* This is where to include current user data */}
        {/* User Profile */}
        <div className="user-profile">
          <div className="avatar">EM</div>
          <div className="user-details">
            <span className="name">Dr. Elias Mbeki</span>
            <span className="role">REB Chair</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

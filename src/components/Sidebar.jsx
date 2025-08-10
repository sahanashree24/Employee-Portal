import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75v11.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5V9.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22.5V12h6v10.5" />
    </svg>
  ),
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
    </svg>
  ),
  attendance: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth={2} fill="none" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2v4M8 2v4" />
    </svg>
  ),
  leaves: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
    </svg>
  ),
  report: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h1" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h3m0 0v6m0-6L7 21" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a1.65 1.65 0 01.33 1.82l-1.4 2.42a1.65 1.65 0 01-2.12.64l-2.52-1a1.65 1.65 0 01-1.15 0l-2.52 1a1.65 1.65 0 01-2.12-.64l-1.4-2.42a1.65 1.65 0 01.33-1.82l2.13-1.7a1.65 1.65 0 010-2.83z" />
    </svg>
  ),
  help: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10a3 3 0 00-3 3" />
    </svg>
  ),
  toggle: (isOpen) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 transition-transform ${isOpen ? "" : "rotate-180"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M12.293 15.707a1 1 0 010-1.414L14.586 12l-2.293-2.293a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0zM7.707 4.293a1 1 0 010 1.414L5.414 8l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" />
    </svg>
  ),
};

const Sidebar = ({ setIsLoggedIn, setUserRole }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  // Keep role reference minimal; attach to data-attribute to avoid unused-var warnings
  const role = (sessionStorage.getItem("userRole") || localStorage.getItem("userRole") || "").toLowerCase();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("failedAttempts");
      sessionStorage.removeItem("lockUntil");

      setIsLoggedIn(false);
      setUserRole("");
      navigate("/", { replace: true });
    }
  };

  const DisabledLink = ({ children, title }) => (
    <li
      className="flex items-center opacity-50 cursor-not-allowed relative group select-none"
      title={title}
      tabIndex={-1}
    >
      {children}
      <span className="absolute left-full ml-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {title}
      </span>
    </li>
  );

  return (
    <div className="flex h-screen">
      <nav
        className={`${isOpen ? "w-64" : "w-14"} bg-gray-900 text-white flex flex-col transition-all duration-300 relative`}
        aria-label="Sidebar"
        data-role={role}
      >
        {/* Toggle button pinned */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center justify-center h-8 w-8 rounded bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={isOpen ? "Collapse" : "Expand"}
          >
            {icons.toggle(isOpen)}
          </button>
        </div>

        {/* Sidebar content — render only when open */}
        {isOpen && (
          <div className="pt-14 px-4 flex flex-col justify-between flex-1">
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isActive ? "bg-blue-600" : ""
                    }`
                  }
                  title="Home"
                >
                  {icons.home} Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isActive ? "bg-blue-600" : ""
                    }`
                  }
                  title="Dashboard"
                >
                  {icons.dashboard} Dashboard
                </NavLink>
              </li>

              {/* Coming soon (disabled) */}
              <DisabledLink title="Coming Soon">
                {icons.attendance} Attendance
              </DisabledLink>
              <DisabledLink title="Coming Soon">
                {icons.leaves} Leaves
              </DisabledLink>
              <DisabledLink title="Coming Soon">
                {icons.report} Report
              </DisabledLink>

              {/* Keep Settings and Help disabled with their own titles */}
              <DisabledLink title="Coming Soon">
                {icons.settings} Settings
              </DisabledLink>
              <DisabledLink title="Coming Soon">
                {icons.help} Help
              </DisabledLink>
            </ul>

            {/* Logout pinned to bottom with safe padding */}
            <div className="pb-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
                aria-label="Logout"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;





















import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import AddEmployee from "./components/AddEmployee";

function App() {
  // Initialize from storage once
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return (
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("isLoggedIn") === "true"
    );
  });

  const [userRole, setUserRole] = useState(() => {
    return (
      localStorage.getItem("userRole") ||
      sessionStorage.getItem("userRole") ||
      ""
    );
  });

  const [rememberMe, setRememberMe] = useState(() =>
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <Routes>
      {/* Public route (login) */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setUserRole={setUserRole}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
            />
          )
        }
      />

      {/* Protected layout + routes */}
      <Route
        element={
          isLoggedIn ? (
            <Sidebar
              setIsLoggedIn={setIsLoggedIn}
              setUserRole={setUserRole}
              userRole={userRole}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />

        {/* ✅ Only allow AddEmployee route for admin */}
        <Route
          path="/employee/add"
          element={
            userRole === "admin" ? (
              <AddEmployee userRole={userRole} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Route>

      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/home" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;








































































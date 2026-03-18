import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { session, logout } = useAuth();

  return (
    <div>
      {/* TOP NAVBAR */}
      <div className="topbar">
        <div className="logo"> Music App</div>

        <div className="nav-links">
          {!session && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}

          {session?.role === "user" && (
            <>
              <NavLink to="/dashboard">Home</NavLink>
              <NavLink to="/playlist">Playlists</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
            </>
          )}

          {session?.role === "admin" && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </div>

        <div className="nav-right">
          {session && (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}
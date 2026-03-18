import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { session, logout } = useAuth();

  return (
    <div className="navbar">
      {!session && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {session?.role === "user" && (
        <>
          <Link to="/dashboard">Home</Link>
          <Link to="/playlist">Playlists</Link>
          <Link to="/favorites">Favorites</Link>
        </>
      )}

      {session?.role === "admin" && <Link to="/admin">Admin</Link>}

      {session && <button onClick={logout}>Logout</button>}
    </div>
  );
}
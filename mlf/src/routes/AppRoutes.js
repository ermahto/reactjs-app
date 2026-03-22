import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import SongDetails from "../pages/SongDetails";
import PlaylistPage from "../pages/PlaylistPage";
import PlaylistDetails from "../pages/PlaylistDetails";
import Favorites from "../pages/Favorites";
import Admin from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ SONG DETAILS */}
        <Route
          path="/song/:id"
          element={
            <ProtectedRoute role="user">
              <SongDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist"
          element={
            <ProtectedRoute role="user">
              <PlaylistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist/:id"
          element={
            <ProtectedRoute role="user">
              <PlaylistDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute role="user">
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
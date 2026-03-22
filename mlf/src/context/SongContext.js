import React, { createContext, useContext, useEffect, useState } from "react";
import { fakeApi } from "../services/mockApi";
import { useAuth } from "./AuthContext";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const { session } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load songs (with optional search)
  const loadSongs = async (query = "") => {
    if (!session) return;

    setLoading(true);

    try {
      const data = await fakeApi.listSongs({
        forRole: session.role,
        query,
      });

      setSongs(data);
    } catch (err) {
      console.error("Error loading songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadSongs();
    }
  }, [session]);

  return (
    <SongContext.Provider value={{ songs, loadSongs, loading }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongContext);

  // ✅ SAFETY CHECK (VERY IMPORTANT)
  if (!context) {
    throw new Error("useSongs must be used inside SongProvider");
  }

  return context;
};
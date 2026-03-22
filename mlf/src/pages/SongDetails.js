import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fakeApi } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";

export default function SongDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [song, setSong] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fakeApi.getSong(id);
      setSong(data);
    };
    load();
  }, [id]);

  if (!song) {
    return <div className="empty">Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* BACK BUTTON */}
      <button className="button" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* MAIN CARD */}
      <div
        style={{
          marginTop: "20px",
          padding: "25px",
          borderRadius: "14px",
          background: "#ffffff", // ✅ FIX: light background
          color: "#111827",       // ✅ FIX: dark text
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>{song.name}</h2>

        <p><strong>🎬 Director:</strong> {song.director}</p>
        <p><strong>💿 Album:</strong> {song.album}</p>
        <p><strong>📅 Release Date:</strong> {song.releaseDate}</p>

        {/* ACTION */}
        <button
          className="button"
          style={{ marginTop: "20px" }}
          onClick={() => fakeApi.toggleFavorite(session.userId, song.id)}
        >
          ❤️ Add to Favorites
        </button>
      </div>
    </div>
  );
}
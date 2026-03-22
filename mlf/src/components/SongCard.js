import React from "react";
import { useNavigate } from "react-router-dom";

export default function SongCard({ song, onFav, onAdd }) {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/song/${song.id}`);
  };

  return (
    <div className="card">
      <h3>{song.name}</h3>
      <p>{song.album}</p>
      <p>{song.director}</p>

      <div className="card-actions">
        <h3>{song.name} TEST BUTTON</h3>
        {/* ✅ NEW DETAILS BUTTON */}
        <button className="button" onClick={goToDetails}>
          📄 Details
        </button>

        {/* FAVORITE */}
        {onFav && (
          <button className="button" onClick={() => onFav(song.id)}>
            ❤️
          </button>
        )}

        {/* ADD (PLAYLIST) */}
        {onAdd && (
          <button
            className="button button-secondary"
            onClick={() => onAdd(song.id)}
          >
            ➕
          </button>
        )}
      </div>
    </div>
  );
}
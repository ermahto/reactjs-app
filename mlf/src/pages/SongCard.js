import React from "react";

export default function SongCard({ song, onFav, onAdd }) {
  return (
    <div className="card" style={{ width: "200px" }}>
      <h3>{song.name}</h3>
      <p>{song.album}</p>
      <p>{song.director}</p>

      <div className="card-actions">
        <button className="button" onClick={() => onFav(song.id)}>
          ❤️
        </button>

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
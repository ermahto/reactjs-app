import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSongs } from "../context/SongContext";
import { fakeApi } from "../services/fakeApi";
import SongCard from "../components/SongCard";

export default function Dashboard() {
  const { session } = useAuth();
  const { songs, loadSongs } = useSongs();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadSongs(query);
  }, [query]);

  const fav = (id) => {
    fakeApi.toggleFavorite(session.userId, id);
  };

  return (
    <div>
      <div className="header">
        <h2>🎵 All Songs</h2>
        <input
          placeholder="Search songs..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {songs.length === 0 ? (
        <div className="empty">No songs found</div>
      ) : (
        <div className="grid">
          {songs.map((s) => (
            <SongCard key={s.id} song={s} onFav={fav} />
          ))}
        </div>
      )}
    </div>
  );
}
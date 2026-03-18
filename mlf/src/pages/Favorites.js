import React, { useEffect, useState } from "react";
import { fakeApi } from "../services/fakeApi";
import { useAuth } from "../context/AuthContext";
import SongCard from "../components/SongCard";

export default function Favorites() {
  const { session } = useAuth();

  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const loadData = async () => {
    const allSongs = await fakeApi.listSongs({ forRole: "user" });
    const fav = await fakeApi.getFavorites(session.userId);

    setSongs(allSongs);
    setFavorites(fav);
  };

  useEffect(() => {
    loadData();
  }, []);

  const favSongs = songs.filter((s) =>
    favorites.some((f) => f.songId === s.id)
  );

  return (
    <div>
      <h2>❤️ Favorites</h2>

      {favSongs.length === 0 ? (
        <div className="empty">No favorites yet</div>
      ) : (
        <div className="grid">
          {favSongs.map((s) => (
            <SongCard key={s.id} song={s} onFav={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
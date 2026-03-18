import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fakeApi } from "../services/fakeApi";
import { useAuth } from "../context/AuthContext";
import SongCard from "../components/SongCard";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { session } = useAuth();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [shuffle, setShuffle] = useState(false);

  // 🔹 Load data
  const loadData = async () => {
    if (!session) return;

    // get all songs
    const allSongs = await fakeApi.listSongs({
      forRole: session.role,
    });
    setSongs(allSongs);

    // get user playlists
    const allPlaylists = await fakeApi.listPlaylists({
      ownerUserId: session.userId,
    });

    const found = allPlaylists.find((p) => p.id === id);
    setPlaylist(found || null);
  };

  useEffect(() => {
    loadData();
  }, [id, session]);

  if (!playlist) {
    return <div className="empty">Playlist not found</div>;
  }

  // 🔹 Songs inside playlist
  const playlistSongs = songs.filter((s) =>
    playlist.songIds.includes(s.id)
  );

  // 🔹 Search inside playlist
  const filtered = playlistSongs.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  // 🔹 Shuffle logic
  const displaySongs = shuffle
    ? [...filtered].sort(() => Math.random() - 0.5)
    : filtered;

  // 🔹 Add song
  const addSong = async (songId) => {
    await fakeApi.addSongToPlaylist(id, songId);
    loadData();
  };

  // 🔹 Remove song
  const removeSong = async (songId) => {
    await fakeApi.removeSongFromPlaylist(id, songId);
    loadData();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <h2>🎧 {playlist.name}</h2>

        <input
          placeholder="Search in playlist..."
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="button" onClick={() => setShuffle(!shuffle)}>
          {shuffle ? "Disable Shuffle" : "Shuffle"}
        </button>
      </div>

      {/* PLAYLIST SONGS */}
      <h3>Playlist Songs</h3>

      {displaySongs.length === 0 ? (
        <div className="empty">No songs in playlist</div>
      ) : (
        <div className="grid">
          {displaySongs.map((s) => (
            <SongCard
              key={s.id}
              song={s}
              onFav={() => {}}
              onAdd={() => removeSong(s.id)}
            />
          ))}
        </div>
      )}

      {/* ALL SONGS */}
      <h3 style={{ marginTop: "20px" }}>All Songs</h3>

      <div className="grid">
        {songs.map((s) => (
          <SongCard
            key={s.id}
            song={s}
            onFav={() => {}}
            onAdd={() => addSong(s.id)}
          />
        ))}
      </div>
    </div>
  );
}
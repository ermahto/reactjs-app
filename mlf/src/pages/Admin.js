import React, { useEffect, useState } from "react";
import { fakeApi } from "../services/fakeApi";

export default function Admin() {
  const [songs, setSongs] = useState([]);

  const load = () => {
    fakeApi.listSongs({ forRole: "admin" }).then(setSongs);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Confirm Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this song?");
    if (!confirmDelete) return;

    await fakeApi.deleteSong(id);
    load();
  };

  // ✅ Confirm Visibility Toggle
  const handleToggleVisibility = async (song) => {
    const message = song.isVisibleToUsers
      ? "Hide this song from users?"
      : "Make this song visible to users?";

    const confirmAction = window.confirm(message);
    if (!confirmAction) return;

    await fakeApi.setSongVisibility(song.id, !song.isVisibleToUsers);
    load();
  };

  // ✅ Confirm Create (optional but good UX)
  const handleAddSong = async () => {
    const confirmAdd = window.confirm("Add new sample song?");
    if (!confirmAdd) return;

    await fakeApi.createSong({
      name: "New Song",
      director: "Admin",
      album: "Test Album",
      releaseDate: "2024"
    });

    load();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <button onClick={handleAddSong}>Add Song</button>

      {songs.map((s) => (
        <div key={s.id} style={{ marginBottom: "10px" }}>
          <strong>{s.name}</strong> | {s.album}

          <div>
            <button onClick={() => handleDelete(s.id)}>Delete</button>

            <button onClick={() => handleToggleVisibility(s)}>
              {s.isVisibleToUsers ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
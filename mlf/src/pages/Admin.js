import React, { useEffect, useState } from "react";
import { fakeApi as mockApi } from "../services/mockApi";

export default function Admin() {
  const [songs, setSongs] = useState([]);

  // create form
  const [form, setForm] = useState({
    name: "",
    director: "",
    album: "",
    releaseDate: ""
  });

  // edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    const data = await mockApi.listSongs({ forRole: "admin" });
    setSongs(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ===== CREATE =====
  const createSong = async () => {
    if (!form.name) return;

    await mockApi.createSong(form);

    setForm({
      name: "",
      director: "",
      album: "",
      releaseDate: ""
    });

    load();
  };

  // ===== DELETE =====
  const remove = async (id) => {
    if (!window.confirm("Delete this song?")) return;

    await mockApi.deleteSong(id);
    load();
  };

  // ===== TOGGLE VISIBILITY =====
  const toggleVisibility = async (song) => {
    await mockApi.setSongVisibility(
      song.id,
      !song.isVisibleToUsers
    );
    load();
  };

  // ===== EDIT START =====
  const startEdit = (song) => {
    setEditId(song.id);
    setEditForm(song);
  };

  // ===== EDIT SAVE =====
  const saveEdit = async () => {
    await mockApi.updateSong(editId, editForm);
    setEditId(null);
    setEditForm({});
    load();
  };

  return (
    <div>
      <h2>🎵 Admin Song Manager</h2>

      {/* CREATE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Song Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Director"
          value={form.director}
          onChange={(e) =>
            setForm({ ...form, director: e.target.value })
          }
        />
        <input
          placeholder="Album"
          value={form.album}
          onChange={(e) =>
            setForm({ ...form, album: e.target.value })
          }
        />
        <input
          placeholder="Release Date"
          value={form.releaseDate}
          onChange={(e) =>
            setForm({ ...form, releaseDate: e.target.value })
          }
        />

        <button className="button" onClick={createSong}>
          Add Song
        </button>
      </div>

      {/* LIST */}
      <div className="grid">
        {songs.map((s) => (
          <div key={s.id} className="card">
            {editId === s.id ? (
              <>
                {/* EDIT MODE */}
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  value={editForm.director}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      director: e.target.value
                    })
                  }
                />
                <input
                  value={editForm.album}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      album: e.target.value
                    })
                  }
                />
                <input
                  value={editForm.releaseDate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      releaseDate: e.target.value
                    })
                  }
                />

                <div className="card-actions">
                  <button className="button" onClick={saveEdit}>
                    Save
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <h3>{s.name}</h3>
                <p>{s.album}</p>
                <p>{s.director}</p>

                <div className="card-actions">
                  <button
                    className="button"
                    onClick={() => startEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="button button-secondary"
                    onClick={() => remove(s.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="button button-secondary"
                    onClick={() => toggleVisibility(s)}
                  >
                    {s.isVisibleToUsers ? "Hide" : "Show"}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
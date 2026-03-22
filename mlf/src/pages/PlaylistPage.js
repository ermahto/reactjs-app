import React, { useEffect, useState } from "react";
import { fakeApi } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PlaylistPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    const data = await fakeApi.listPlaylists({
      ownerUserId: session.userId,
    });
    setPlaylists(data);
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE
  const create = async () => {
    if (!name) return;

    await fakeApi.createPlaylist({
      ownerUserId: session.userId,
      name,
    });

    setName("");
    load();
  };

  // DELETE
  const remove = async (id) => {
    if (!window.confirm("Delete this playlist?")) return;

    await fakeApi.deletePlaylist(id);
    load();
  };

  // START EDIT
  const startEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name);
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
    await fakeApi.updatePlaylist(id, { name: editName });
    setEditId(null);
    setEditName("");
    load();
  };

  return (
    <div>
      <h2>🎵 Your Playlists</h2>

      {/* CREATE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="New playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="button" onClick={create}>
          Create
        </button>
      </div>

      {/* LIST */}
      {playlists.length === 0 ? (
        <div className="empty">No playlists created</div>
      ) : (
        <div className="grid">
          {playlists.map((p) => (
            <div key={p.id} className="card">
              {/* EDIT MODE */}
              {editId === p.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <div className="card-actions">
                    <button
                      className="button"
                      onClick={() => saveEdit(p.id)}
                    >
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
                  <h3>{p.name}</h3>

                  <div className="card-actions">
                    {/* OPEN */}
                    <button
                      className="button"
                      onClick={() => navigate(`/playlist/${p.id}`)}
                    >
                      Open
                    </button>

                    {/* RENAME */}
                    <button
                      className="button button-secondary"
                      onClick={() => startEdit(p)}
                    >
                      Rename
                    </button>

                    {/* DELETE */}
                    <button
                      className="button button-secondary"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
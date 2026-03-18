import { useEffect, useState } from "react";
import { fakeApi } from "../services/fakeApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function PlaylistPage() {
  const { session } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  const load = () => {
    fakeApi.listPlaylists({ ownerUserId: session.userId }).then(setPlaylists);
  };

  useEffect(load, []);

  const create = async () => {
    await fakeApi.createPlaylist({ ownerUserId: session.userId, name });
    setName("");
    load();
  };

  return (
    <div>
      <h2>Playlists</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <button onClick={create}>Create</button>

      {playlists.map(p => (
        <div key={p.id}>
          <Link to={`/playlist/${p.id}`}>{p.name}</Link>
          <button onClick={() => fakeApi.deletePlaylist(p.id).then(load)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
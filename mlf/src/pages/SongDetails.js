import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fakeApi } from "../services/fakeApi";

export default function SongDetails() {
  const { id } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    fakeApi.getSong(id).then(setSong);
  }, [id]);

  if (!song) return <div>Loading...</div>;

  return (
    <div>
      <h2>{song.name}</h2>
      <p>Director: {song.director}</p>
      <p>Album: {song.album}</p>
      <p>Release: {song.releaseDate}</p>
    </div>
  );
}
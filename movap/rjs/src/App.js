import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./app/api";
import {
  fetchFavorites,
  fetchMovies,
  selectMovie,
  toggleFavorite,
} from "./features/movies/moviesSlice";
import {
  createWatchlist,
  deleteWatchlist,
  fetchWatchlists,
  updateWatchlist,
} from "./features/watchlists/watchlistsSlice";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Movie Library Login</h2>
        <input placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="login-error">{error}</p>}
        <button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              setError("");
              console.log("==>> Login attempt:", name);

              const { data } = await api.post("/auth/login", {
                username: name.trim(),
                password: password.trim(),
              });

              console.log("==>> Login success:", data);

              onLogin(data);
              navigate(data.role === "ADMIN" ? "/admin" : "/app");
            } catch (e) {
              console.error("==>> Login failed:", e);
              setError(e?.response?.data?.message || "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

function AppShell({ session, onLogout }) {
  const dispatch = useDispatch();

  const { items = [], selected, favorites = [], loading } =
    useSelector((s) => s.movies || {});
  const watchlists = useSelector((s) => s.watchlists?.items || []);

  const [newWatchlist, setNewWatchlist] = useState("");
  const [userCatalogSearch, setUserCatalogSearch] = useState("");


  useEffect(() => {
    console.log("==>> App Init → Fetching data for user:", session.userId);

    dispatch(fetchMovies());
    dispatch(fetchFavorites(session.userId));
    dispatch(fetchWatchlists(session.userId));
  }, [dispatch, session.userId]);

 
  useEffect(() => {
    console.log("==>> Movies:", items);
    console.log("==>> Favorites:", favorites);
    console.log("==>> Watchlists:", watchlists);
  }, [items, favorites, watchlists]);

 
  const filteredUserMovies = items.filter((m) => {
    const q = userCatalogSearch.trim().toLowerCase();
    if (!q) return true;

    return (
      (m.title || "").toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q) ||
      (m.genres || []).some((g) => g.toLowerCase().includes(q)) ||
      (m.actors || []).some((a) => a.toLowerCase().includes(q))
    );
  });

  
  const handleAddToWatchlist = (watchlist, movieId) => {
    console.log("==>> Add → Watchlist:", {
      watchlist: watchlist.name,
      movieId,
      before: watchlist.movieIds,
    });

    const updatedMovieIds = watchlist.movieIds?.includes(movieId)
      ? watchlist.movieIds
      : [...(watchlist.movieIds || []), movieId];

    console.log("==>> After Add:", updatedMovieIds);

    dispatch(
      updateWatchlist({
        id: watchlist.id,
        userId: session.userId,
        name: watchlist.name,
        movieIds: updatedMovieIds,
      })
    );
  };

  const handleRemoveFromWatchlist = (watchlist, movieId) => {
    console.log("==>> Remove → Watchlist:", {
      watchlist: watchlist.name,
      movieId,
      before: watchlist.movieIds,
    });

    const updatedMovieIds = (watchlist.movieIds || []).filter(
      (id) => id !== movieId
    );

    console.log("==>> After Remove:", updatedMovieIds);

    dispatch(
      updateWatchlist({
        id: watchlist.id,
        userId: session.userId,
        name: watchlist.name,
        movieIds: updatedMovieIds,
      })
    );
  };

  return (
    <div className="app">
      <header className="topnav">
        <h1>Movie Library</h1>
        <div className="session-info">
          <span>{session.username} ({session.role})</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="layout">
        {/* LEFT */}
        <aside className="left-panel">
          <h3>Filters</h3>
          <p>Search using top bar</p>
        </aside>

        {/* GRID */}
        <section className="grid-panel">
          <h3>Movies</h3>

          <div className="catalog-search">
            <input
              placeholder="Search movies..."
              value={userCatalogSearch}
              onChange={(e) => setUserCatalogSearch(e.target.value)}
            />
          </div>

          {loading && <p>Loading...</p>}

          <div className="movie-grid">
            {filteredUserMovies.map((m) => (
              <article
                key={m.id}
                className="card"
                onClick={() => dispatch(selectMovie(m))}
              >
                <div className="poster">Poster</div>
                <h4>{m.title}</h4>
                <p>{(m.genres || []).join(", ")}</p>

                {/* Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("==>> Toggle Favorite:", m.id);

                    dispatch(
                      toggleFavorite({
                        userId: session.userId,
                        movieId: m.id,
                        isFavorite: favorites.includes(m.id),
                      })
                    );
                  }}
                >
                  {favorites.includes(m.id)
                    ? "Unfavorite"
                    : "Favorite"}
                </button>

                {/* Watchlist */}
                <div className="watchlist-actions">
                  {watchlists.map((w) => {
                    const exists = (w.movieIds || []).includes(m.id);

                    return (
                      <button
                        key={w.id}
                        onClick={(e) => {
                          e.stopPropagation();

                          exists
                            ? handleRemoveFromWatchlist(w, m.id)
                            : handleAddToWatchlist(w, m.id);
                        }}
                      >
                        {exists
                          ? `Remove from ${w.name}`
                          : `Add to ${w.name}`}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="right-panel">
          <h3>Details</h3>
          {selected ? <p>{selected.title}</p> : <p>Select a movie</p>}
        </aside>
      </main>

      {/* WATCHLIST */}
      <section className="bottom-watchlists">
        <h3>Custom Watchlists</h3>

        <div className="watchlist-add">
          <input
            value={newWatchlist}
            onChange={(e) => setNewWatchlist(e.target.value)}
            placeholder="Watchlist name"
          />
          <button
            onClick={() => {
              if (newWatchlist.trim()) {
                console.log("==>> Create Watchlist:", newWatchlist);

                dispatch(
                  createWatchlist({
                    userId: session.userId,
                    name: newWatchlist,
                  })
                );

                setNewWatchlist("");
              }
            }}
          >
            Create
          </button>
        </div>

        <div className="watchlists">
          {watchlists.map((w) => (
            <div className="watch-item" key={w.id}>
              <h4>{w.name}</h4>

              <ul>
                {(w.movieIds || []).length === 0 ? (
                  <li className="empty">No movies added</li>
                ) : (
                  w.movieIds.map((movieId) => {
                    const movie = items.find(
                      (m) => m.id === movieId
                    );

                    return movie ? (
                      <li key={movieId}>
                        {movie.title}
                        <button
                          onClick={() =>
                            handleRemoveFromWatchlist(
                              w,
                              movieId
                            )
                          }
                        >
                          Remove
                        </button>
                      </li>
                    ) : null;
                  })
                )}
              </ul>

              <button
                onClick={() => {
                  console.log("==>> Delete Watchlist:", w);
                  dispatch(deleteWatchlist(w.id));
                }}
              >
                Delete Watchlist
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={setSession} />} />
      <Route
        path="/app"
        element={
          session ? (
            <AppShell
              session={session}
              onLogout={() => setSession(null)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
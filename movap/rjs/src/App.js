import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./app/api";
import { fetchFavorites, fetchMovies, selectMovie, toggleFavorite } from "./features/movies/moviesSlice";
import { createWatchlist, deleteWatchlist, fetchWatchlists, updateWatchlist } from "./features/watchlists/watchlistsSlice";


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
                password: password.trim()
              });
              console.log("==>> Login success:", data);
              onLogin(data);
              navigate(data.role === "ADMIN" ? "/admin" : "/app");
            } catch (e) {
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
  const { items, selected, favorites, loading } = useSelector((s) => s.movies);
  const watchlists = useSelector((s) => s.watchlists.items);
  //const reviewsByMovie = useSelector((s) => s.reviews.byMovie);

  const [newWatchlist, setNewWatchlist] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userCatalogSearch, setUserCatalogSearch] = useState("");

  useEffect(() => {
    console.log("==>> App Init → Fetching data for user:", session.userId);
    dispatch(fetchMovies());
    dispatch(fetchFavorites(session.userId));
    dispatch(fetchWatchlists(session.userId));
    if (session.role === "ADMIN") {
      //
    }
  }, [dispatch, session.role, session.userId]);

  useEffect(() => {
    console.log("==>> Movies:", items);
    console.log("==>> Favorites:", favorites);
    console.log("==>> Watchlists:", watchlists);
    if (selected?.id) {
      // dispatch(fetchReviewsByMovie(selected.id));
    }
  }, [dispatch, selected]);


  const filteredUserMovies = items.filter((m) => {
    const q = userCatalogSearch.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      (m.title || "").toLowerCase().includes(q) ||
      (m.description || "").toLowerCase().includes(q) ||
      (m.genres || []).some((g) => (g || "").toLowerCase().includes(q)) ||
      (m.actors || []).some((a) => (a || "").toLowerCase().includes(q))
    );
  });


  const handleAddToWatchlist = (watchlist, movieId) => {
    console.log("==>>c Add → Watchlist:", {
      watchlist: watchlist.name,
      movieId,
      before: watchlist.movieIds,
    });
    const updatedMovieIds = watchlist.movieIds.includes(movieId)
      ? watchlist.movieIds
      : [...watchlist.movieIds, movieId];
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
    const updatedMovieIds = watchlist.movieIds.filter((id) => id !== movieId);
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

      {session.role !== "ADMIN" ? (
        <>
          <main className="layout">
            <aside className="left-panel">
              <h3>Filters</h3>
              <p>Use title/genre/actor search above.</p>
            </aside>

            <section className="grid-panel">
              <h3>Movies</h3>
              <div className="catalog-search">
                <input
                  placeholder="Search movies by title, genre, actor, description"
                  value={userCatalogSearch}
                  onChange={(e) => setUserCatalogSearch(e.target.value)}
                />
              </div>
              {loading && <p>Loading...</p>}
              <div className="movie-grid">
                {filteredUserMovies.map((m) => (
                  <article key={m.id} className="card" onClick={() => dispatch(selectMovie(m))}>
                    <div className="poster">Poster</div>
                    <h4>{m.title}</h4>
                    <p>{(m.genres || []).join(", ")}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                         console.log("==>> Toggle Favorite:", m.id);
                        dispatch(toggleFavorite({ userId: session.userId, movieId: m.id, isFavorite: favorites.includes(m.id) }));
                      }}
                    >
                      {favorites.includes(m.id) ? "Unfavorite" : "Favorite"}
                    </button>

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
                            {exists ? `Remove from ${w.name}` : `Add to ${w.name}`}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="right-panel">
              <h3>Details & Reviews</h3>
              {selected ? (
                <>
                  <h4>{selected.title}</h4>
                  <p>{selected.description}</p>
                  <p>Year: {selected.year} | Rating: {selected.avgRating}</p>

                  <div className="review-form">
                    <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
                    <input placeholder="Write review" value={comment} onChange={(e) => setComment(e.target.value)} />
                    <button
                      onClick={() => {
                        //dispatch(submitReview({ movieId: selected.id, userId: session.userId, rating, comment }));
                        setComment("");
                      }}
                    >
                      Submit Review
                    </button>
                  </div>

                  <ul>
                    {/* {(reviewsByMovie[selected.id] || []).map((r) => (
                      <li key={r.id}>{r.rating}* - {r.comment}</li>
                    ))} */}
                  </ul>
                </>
              ) : <p>Select a movie.</p>}
            </aside>
          </main>

          <section className="bottom-watchlists">
            <h3>Custom Watchlists</h3>
            <div className="watchlist-add">
              <input value={newWatchlist} onChange={(e) => setNewWatchlist(e.target.value)} placeholder="Watchlist name" />
              <button
                onClick={() => {
                  if (newWatchlist.trim()) {
                    console.log("==>> Create Watchlist:", newWatchlist);
                    dispatch(createWatchlist({ userId: session.userId, name: newWatchlist }));
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

                  {/* Movies inside watchlist */}
                  <ul>
                    {(w.movieIds || []).length === 0 ? (
                      <li>No movies added</li>
                    ) : (
                      w.movieIds.map((movieId) => {
                        const movie = items.find((m) => m.id === movieId);

                        return movie ? (
                          <li key={movieId}>
                            {movie.title}
                            <button
                              onClick={() =>
                                handleRemoveFromWatchlist(w, movieId)
                              }
                            >
                              Remove
                            </button>
                          </li>
                        ) : null;
                      })
                    )}
                  </ul>

                  {/* Delete Watchlist */}
                  <button onClick={() => {
                     console.log("==>> Delete Watchlist:", w);
                    dispatch(deleteWatchlist(w.id))}}>
                    Delete Watchlist
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="admin-panel">
          <h3>Admin Mini-Panel</h3>

        </section>
      )}
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
            <AppShell session={session} onLogout={() => setSession(null)} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          session && session.role === "ADMIN" ? (
            <AppShell session={session} onLogout={() => setSession(null)} />
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

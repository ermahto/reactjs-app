import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../features/movies/moviesSlice";
import watchlistsReducer from "../features/watchlists/watchlistsSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchlists: watchlistsReducer
  }
});

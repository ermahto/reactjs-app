import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async (params = {}) => {
  const { data } = await api.get("/movies", { params });
  return data;
});

export const fetchFavorites = createAsyncThunk("movies/fetchFavorites", async (userId) => {
  const { data } = await api.get("/favorites", { params: { userId } });
  return data;
});

export const toggleFavorite = createAsyncThunk("movies/toggleFavorite", async ({ userId, movieId, isFavorite }) => {
  if (isFavorite) {
    const { data } = await api.delete(`/favorites/${userId}/${movieId}`);
    return data;
  }
  const { data } = await api.post(`/favorites/${userId}/${movieId}`);
  return data;
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: { items: [], selected: null, favorites: [], loading: false },
  reducers: {
    selectMovie: (state, action) => {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        if (!state.selected && action.payload.length) {
          state.selected = action.payload[0];
        }
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  }
});

export const { selectMovie } = moviesSlice.actions;
export default moviesSlice.reducer;

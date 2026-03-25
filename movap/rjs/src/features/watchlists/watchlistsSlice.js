import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

export const fetchWatchlists = createAsyncThunk("watchlists/fetch", async (userId) => {
  const { data } = await api.get("/watchlists", { params: { userId } });
  return data;
});

export const createWatchlist = createAsyncThunk("watchlists/create", async ({ userId, name }) => {
  const { data } = await api.post("/watchlists", { userId, name, movieIds: [] });
  return data;
});

export const updateWatchlist = createAsyncThunk("watchlists/update", async ({ id, userId, name, movieIds }) => {
  const { data } = await api.put(`/watchlists/${id}`, { userId, name, movieIds });
  return data;
});

export const deleteWatchlist = createAsyncThunk("watchlists/delete", async (id) => {
  await api.delete(`/watchlists/${id}`);
  return id;
});

const watchlistsSlice = createSlice({
  name: "watchlists",
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlists.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createWatchlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateWatchlist.fulfilled, (state, action) => {
        state.items = state.items.map((w) => (w.id === action.payload.id ? action.payload : w));
      })
      .addCase(deleteWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      });
  }
});

export default watchlistsSlice.reducer;

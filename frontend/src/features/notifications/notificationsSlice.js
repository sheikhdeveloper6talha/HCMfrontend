import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifications, markAllNotificationsRead } from "../../services/miscService";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
  try { return await getNotifications(); } catch { return rejectWithValue("failed"); }
});
export const readAll = createAsyncThunk("notifications/readAll", async () => { await markAllNotificationsRead(); });

const slice = createSlice({
  name: "notifications",
  initialState: { items: [], unread: 0, loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true; })
      .addCase(fetchNotifications.fulfilled, (s, a) => { s.items = a.payload.data; s.unread = a.payload.unread; s.loading = false; })
      .addCase(fetchNotifications.rejected, (s) => { s.loading = false; })
      .addCase(readAll.fulfilled, (s) => { s.unread = 0; s.items = s.items.map((n) => ({ ...n, read: true })); });
  },
});
export default slice.reducer;

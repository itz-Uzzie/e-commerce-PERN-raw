import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  n_id: number;
  u_id: number;
  content: string;
  isread: boolean;
  created_at: string;
}

const initialState = {
  notifications: {} as Notification[],
  isLoading: false,
};

export const fetchnotifications = createAsyncThunk('fetch/notifications', async (u_id: number) => {
  const response = await fetch(`http://localhost:4000/api/v1/notification/${u_id}`, { method: "GET" });
  if (response.ok) {
    return await response.json();
  }
})

export const mark_as_read = createAsyncThunk('mark-as-read/notifications', async (n_id: number) => {
  const response = await fetch(`http://localhost:4000/api/v1/notification/mark_as_read/${n_id}`, { method: "PATCH" });
  if (response.ok) {
    return n_id;
  }
})

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchnotifications.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchnotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
    })
    .addCase(fetchnotifications.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(mark_as_read.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(mark_as_read.fulfilled, (state, action) => {
      const notification = state.notifications.find((not) => not.n_id === action.payload);
      if (notification) notification.isread = true;
      state.isLoading = false;
    })
    .addCase(mark_as_read.rejected, (state) => {
      state.isLoading = false;
    })
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

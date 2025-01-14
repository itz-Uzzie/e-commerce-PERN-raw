import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  n_id: string;
  u_id: string;
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

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state) => {
      state.notifications.forEach((n) => (n.isread = true));
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchnotifications.pending,(state)=>{
      state.isLoading = true;
    })
    builder.addCase(fetchnotifications.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.notifications = action.payload;
    })
    builder.addCase(fetchnotifications.rejected,(state)=>{
      state.isLoading = false;
    })
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;

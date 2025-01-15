import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface u { u_id: number, name: string, email: string, password: string }

const initialState = {
    isLoading: false,
    users: {} as u[]
}

export const fetchAllUsers = createAsyncThunk('admin/allusers/data', async () => {
    const response = await fetch(`http://localhost:4000/api/v1/admin/allusers`, { method: "GET", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    if (!response.ok) {
        localStorage.removeItem("token");
    }
    return await response.json();
})

export const removeruser = createAsyncThunk('remove/user', async (u_id: number) => {
    const response = await fetch(`http://localhost:4000/api/v1/admin/removeuser/${u_id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    if (response.ok) {
        return u_id;
    }
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        })
        builder.addCase(fetchAllUsers.rejected, (state) => {
            state.isLoading = false;
            console.log("Something went wrong");
        })

        builder.addCase(removeruser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user.u_id !== action.payload)
        })
    }
});
export default userSlice.reducer;
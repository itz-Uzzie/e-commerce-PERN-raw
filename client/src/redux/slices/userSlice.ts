import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface u { u_id: number, name: string, email: string, password: string, isadmin: boolean }
interface tokens { exp: number, iat: number, isadmin: boolean, u_id: number }

const initialState = {
    isLoading: false,
    user: {} as u,
    decodeduser: {} as tokens
}
interface RootState {
    user: typeof initialState;
}

export const fetchuser = createAsyncThunk('user/data', async (_, { getState }) => {
    const state = getState() as RootState;
    const { decodeduser } = state.user;
    if (!decodeduser.u_id) return null;
    const response = await fetch(`http://localhost:4000/api/v1/user/profile/${decodeduser.u_id}`, { method: "GET", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    if (!response.ok) {
        localStorage.removeItem("token");
    }
    return await response.json();
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setFromLocal(state) {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode<tokens>(token);
                state.decodeduser = decoded;
            }
        },
        removeUser(state) {
            localStorage.removeItem("token");
            state.decodeduser = {} as tokens;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchuser.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchuser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        })
        builder.addCase(fetchuser.rejected, (state) => {
            state.isLoading = false;
            console.log("Something went wrong");
        })
    }
});
export const { setFromLocal, removeUser } = userSlice.actions;
export default userSlice.reducer;
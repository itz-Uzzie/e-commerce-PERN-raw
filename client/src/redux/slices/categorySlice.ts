import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ct { ct_id: number, name: string };
const initialState = {
    categories: {} as ct[],
    isloading: false
}
export const fetchCategories = createAsyncThunk('fetchCategories', async () => {
    const categories = await fetch(`http://localhost:4000/api/v1/category/all`, { method: "GET" });
    return await categories.json();
})

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchCategories.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.isloading = false;
            state.categories = action.payload;
        })
        builder.addCase(fetchCategories.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export default categorySlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface sales_item {
    oi_id: number, name: string, quantity: number, payment: string, delivery: string
}

const initialState = {
    sales: {} as sales_item[],
    isloading: false
};

export const fetchMySales = createAsyncThunk('fetch/mysales', async (u_id: number) => {
    const response = await fetch(`http://localhost:4000/api/v1/sales/${u_id}`, { method: "GET" });
    if (response.ok) {
        return await response.json();
    }
})

const mysalesSlice = createSlice({
    name: "mysales",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchMySales.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchMySales.fulfilled, (state, action) => {
            state.isloading = false;
            state.sales = action.payload;
        })
        builder.addCase(fetchMySales.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export default mysalesSlice.reducer;

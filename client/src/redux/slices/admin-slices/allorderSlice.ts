import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface product {
    product_name: string, quantity: number, price: number
}
interface order {
    o_id: number, total_price: number, delivery_status: string, payment_status: string,
    products: product[]
}

const initialState = {
    orders: {} as order[],
    isLoading: false
};

export const fetchAllOrders = createAsyncThunk('admin/allorders/data', async () => {
    const response = await fetch(`http://localhost:4000/api/v1/admin/allorders`, { method: "GET", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
    if (!response.ok) {
        localStorage.removeItem("token");
    }
    return await response.json();
})

const allorderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        builder.addCase(fetchAllOrders.rejected, (state) => {
            state.isLoading = false;
            console.log("Something went wrong");
        })
    }
});
export default allorderSlice.reducer;
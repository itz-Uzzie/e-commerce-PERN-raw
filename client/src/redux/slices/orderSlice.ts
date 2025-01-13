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
    isloading: false
};

export const fetchMyOrders = createAsyncThunk('fetch/myorders', async (u_id: number) => {
    const response = await fetch(`http://localhost:4000/api/v1/order/myorders/${u_id}`, { method: "GET" });
    if (response.ok) {
        return await response.json();
    }
})

const myordersSlice = createSlice({
    name: "myorders",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchMyOrders.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
            state.isloading = false;
            state.orders = action.payload;
        })
        builder.addCase(fetchMyOrders.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export default myordersSlice.reducer;

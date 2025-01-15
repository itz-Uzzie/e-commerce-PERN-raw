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

export const approvePayment = createAsyncThunk('payment/approve', async (o_id: number) => {
    const response = await fetch(`http://localhost:4000/api/v1/admin/payment/approve/${o_id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (!response.ok) {
        console.log("Something went wrong");
    }
    return o_id;
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
        });

        builder.addCase(approvePayment.fulfilled, (state, action) => {
            const order = state.orders.find((order) => order.o_id == action.payload);
            if (order) order.payment_status = 'approved'
            state.isLoading = false;
            console.log("Payment approved successfully");
        });
    }
});
export default allorderSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface cart_product { quantity: number, name: string, price: number, p_id: number, image: string };
const initialState = {
    products: {} as cart_product[],
    isloading: false
}
export const fetchCart = createAsyncThunk('fetchCart', async (u_id: number) => {
    const cart = await fetch(`http://localhost:4000/api/v1/cart/mycart/${u_id}`, { method: "GET" });
    return await cart.json();
})

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchCart.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.products = action.payload;
            state.isloading = false;
        })
        builder.addCase(fetchCart.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export default cartSlice.reducer;
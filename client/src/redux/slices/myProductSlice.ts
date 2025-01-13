import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface p { p_id: number, name: string, price: number, images: string };
const initialState = { products: {} as p[], isloading: false }

export const fetchmyProducts = createAsyncThunk('fetchProducts', async (u_id: number) => {
    const products = await fetch(`http://localhost:4000/api/v1/product/myproducts/${u_id}`, { method: "GET" });
    return await products.json();
})

const myproductSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        resetProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchmyProducts.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchmyProducts.fulfilled, (state, action) => {
            state.isloading = false;
            state.products = action.payload;
        })
        builder.addCase(fetchmyProducts.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export const { resetProducts } = myproductSlice.actions;
export default myproductSlice.reducer;
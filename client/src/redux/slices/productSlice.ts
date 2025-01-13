import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface p { p_id: number, name: string, price: number, images: string, owner: string };
const initialState = { products: {} as p[], isloading: false }

export const fetchProducts = createAsyncThunk('fetchProducts', async ({ ct_id, page }: { ct_id: number | null, page: number | null }) => {
    const url = `http://localhost:4000/api/v1/product/all`;
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page.toString());
        params.append('limit', '9')
    }
    if (ct_id) {
        params.append('ct_id', ct_id.toString());
    }
    const products = await fetch(`${url}?${params.toString()}`, { method: "GET" });
    return await products.json();
})

export const fetchdetails = createAsyncThunk('fetchDetails', async (p_id: number) => {
    const response = await fetch(`http://localhost:4000/api/v1/product/${p_id}`, { method: "GET" });
    if (response.ok) {
        const product = await response.json();
        const xyz = localStorage.getItem("product");
        if (xyz) localStorage.removeItem("product");
        localStorage.setItem('product', JSON.stringify(product));
        return product;
    } else {
        throw new Error("Failed to fetch product details");
    }
})

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        resetProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchProducts.pending, (state) => {
            state.isloading = true;
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.isloading = false;
            state.products = action.payload;
        })
        builder.addCase(fetchProducts.rejected, (state) => {
            state.isloading = false;
        })
    },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
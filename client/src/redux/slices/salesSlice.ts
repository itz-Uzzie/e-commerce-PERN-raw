import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface sales_item {
    oi_id: number;
    name: string;
    quantity: number;
    payment: string;
    delivery: string;
}

const initialState = {
    sales: [] as sales_item[],
    isloading: false,
};

export const fetchMySales = createAsyncThunk(
    "fetch/mysales",
    async (u_id: number) => {
        const response = await fetch(`http://localhost:4000/api/v1/sales/${u_id}`);
        if (response.ok) {
            return await response.json();
        }
    }
);

export const updateDeliveryStatus = createAsyncThunk(
    "update/delivery-status",
    async ({
        oi_id,
        delivery,
    }: {
        oi_id: number;
        delivery: string;
    }) => {
        const response = await fetch(
            `http://localhost:4000/api/v1/sales/update/delivery/${oi_id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ delivery }),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to update delivery status");
        }
        return await response.json() as { oi_id: number; delivery: string };
    }
);

const mysalesSlice = createSlice({
    name: "mysales",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMySales.pending, (state) => {
                state.isloading = true;
            })
            .addCase(fetchMySales.fulfilled, (state, action) => {
                state.isloading = false;
                state.sales = action.payload;
            })
            .addCase(fetchMySales.rejected, (state) => {
                state.isloading = false;
            })
            .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
                const { oi_id, delivery } = action.payload;
                const sale = state.sales.find((sale) => sale.oi_id === oi_id);
                if (sale) sale.delivery = delivery;
            });
    },
});

export default mysalesSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Address {
  city: string;
  country: string;
  area: string;
}

interface Product {
  p_id: number;
  quantity: number;
  name: string;
  price: number;
}

interface OrderState {
  address: Address | null;
  products: Product[];
}

const initialState: OrderState = {
  address: null,
  products: [],
};

const orderDetailSlice = createSlice({
  name: "order_details",
  initialState,
  reducers: {
    setOrderDetails(state, action: PayloadAction<{ address: Address; products: Product[] }>) {
      state.address = action.payload.address;
      state.products = action.payload.products;
    },
    updateProductQuantity(state, action: PayloadAction<{ p_id: number; quantity: number }>) {
      const product = state.products.find((prod) => prod.p_id === action.payload.p_id);
      if (product && action.payload.quantity > 0) {
        product.quantity = action.payload.quantity;
      }
    },
  },
});

export const { setOrderDetails, updateProductQuantity } = orderDetailSlice.actions;
export default orderDetailSlice.reducer;

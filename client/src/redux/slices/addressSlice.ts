import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Address {
  city: string;
  country: string;
  area: string;
}

interface AddressState {
  address: Address | null;
}

const initialState: AddressState = {
  address: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<Address>) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;

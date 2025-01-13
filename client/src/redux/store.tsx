import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import userreducer from "./slices/userSlice";
import productreducer from "./slices/productSlice";
import categoryreducer from "./slices/categorySlice";
import cartreducer from "./slices/cartSlice";
import notificationreducer from "./slices/notificationSlice";
import addressreducer from "./slices/addressSlice";
import orderDetailreducer from "./slices/orderDetailSlice";
import myordersreducer from "./slices/orderSlice";
import mysalesreducer from "./slices/salesSlice";
import admin_alluser_reducer from "./slices/admin-slices/alluserSlice";
const store = configureStore({
  reducer: {
    user: userreducer,
    product: productreducer,
    categories: categoryreducer,
    allusers: admin_alluser_reducer,
    cart: cartreducer,
    orderDetails: orderDetailreducer,
    notifications: notificationreducer,
    address: addressreducer,
    order: myordersreducer,
    sale: mysalesreducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>;
export default store;

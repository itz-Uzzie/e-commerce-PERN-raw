import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import userreducer from "./slices/userSlice";
import cartreducer from "./slices/cartSlice";
import mysalesreducer from "./slices/salesSlice";
import myordersreducer from "./slices/orderSlice";
import productreducer from "./slices/productSlice";
import addressreducer from "./slices/addressSlice";
import categoryreducer from "./slices/categorySlice";
import orderDetailreducer from "./slices/orderDetailSlice";
import notificationreducer from "./slices/notificationSlice";
import admin_alluser_reducer from "./slices/admin-slices/alluserSlice";
import admin_allorders_reducer from "./slices/admin-slices/allorderSlice";
const store = configureStore({
  reducer: {
    user: userreducer,
    cart: cartreducer,
    sale: mysalesreducer,
    order: myordersreducer,
    address: addressreducer,
    product: productreducer,
    categories: categoryreducer,
    allusers: admin_alluser_reducer,
    orderDetails: orderDetailreducer,
    notifications: notificationreducer,
    allorders: admin_allorders_reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action>;
export default store;

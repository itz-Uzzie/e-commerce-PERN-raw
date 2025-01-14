import Home from "./Pages/Home";
import Login from "./Pages/Basic-Routes/Login";
import MyCart from "./Pages/Profile-Routes/MyCart";
import Signup from "./Pages/Basic-Routes/Signup";
import Navbar from "./Components/Navbar";
import Profile from "./Pages/Profile-Routes/Profile";
import Loading from "./Components/Loading";
import MySales from "./Pages/Profile-Routes/MySales";
import MyOrders from "./Pages/Profile-Routes/MyOrders";
import Allusers from "./Pages/Admin-Routes/Allusers";
import AllOrders from "./Pages/Admin-Routes/AllOrders";
import MyProducts from "./Pages/Profile-Routes/MyProducts";
import AddProduct from "./Pages/Product-Routes/AddProduct";
import AdminLinks from "./Pages/Admin-Routes/AdminLinks";
import PrivateRoute from "./Components/PrivateRoute";
import OrderConfirmation from "./Pages/OrderConfirmation";
import ProductDetails from "./Pages/Product-Routes/ProductDetails";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { fetchCategories } from "./redux/slices/categorySlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchuser, setFromLocal } from "./redux/slices/userSlice";
const ProtectCheck = React.lazy(() => import("./Components/ProtectCheck"));

function App() {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  useEffect(() => {
    dispatch(setFromLocal());
    dispatch(fetchuser());
    dispatch(fetchCategories());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/product/:p_id" element={<ProductDetails />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLinks />} />
          <Route path="/admin/allusers" element={<Allusers />} />
          <Route path="/admin/allorders" element={<AllOrders />} />
        </Route>
      </Routes>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<ProtectCheck />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/mycart/:u_id" element={<MyCart />} />
            <Route path="/myorders/:u_id" element={<MyOrders />} />
            <Route path="/mysales/:u_id" element={<MySales />} />
            <Route path="/myproducts/:u_id" element={<MyProducts />} />
            <Route path="/orderCheckout" element={<OrderConfirmation />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

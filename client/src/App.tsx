import Home from "./Pages/Home";
import Login from "./Pages/Login";
import MyCart from "./Pages/MyCart";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Navbar from "./Components/Navbar";
import Loading from "./Components/Loading";
import AddProduct from "./Pages/AddProduct";
import ProductDetails from "./Pages/ProductDetails";
import PrivateRoute from "./Components/PrivateRoute";
import Allusers from "./Pages/Admin-Routes/Allusers";
import AdminLinks from "./Pages/Admin-Routes/AdminLinks";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { fetchCategories } from "./redux/slices/categorySlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchuser, setFromLocal } from "./redux/slices/userSlice";
import OrderConfirmation from "./Pages/OrderConfirmation";
import MyOrders from "./Pages/MyOrders";
import MySales from "./Pages/MySales";
import AllOrders from "./Pages/Admin-Routes/AllOrders";
import MyProducts from "./Pages/MyProducts";
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

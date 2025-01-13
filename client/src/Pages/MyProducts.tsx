import ProductCard from "./ProductCard";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Components/Loading";
import { useEffect } from "react";
import { fetchmyProducts } from "../redux/slices/myProductSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

function MyProducts() {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const product = useSelector((state: RootState) => state.myproducts);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const isloading = product.isloading;

  useEffect(() => {
    dispatch(fetchmyProducts(u_id));
  }, [dispatch, u_id]);
  
  if (isloading) {
    return <Loading />;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-8 container mx-auto">
      {product.products.length > 0 &&
        product.products.map((product) => (
          <ProductCard key={product.p_id} product={product} />
        ))}
    </div>
  );
}

export default MyProducts;

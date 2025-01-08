import Loading from "../Components/Loading";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { fetchCart } from "../redux/slices/cartSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

function MyCart() {
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.decodeduser);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();

  useEffect(() => {
    dispatch(fetchCart(user.u_id));
  }, [dispatch, user]);

  if (cart.isloading) {
    return <Loading />;
  }

  return (
    <div className="container flex flex-col items-center w-full px-4 md:px-10">
      <div className="text-center my-6">
        <h2 className="text-2xl font-semibold">All products</h2>
      </div>
      <div className="flex flex-col w-full md:w-3/4 p-4 space-y-6">
        {cart.products.length > 0 &&
          cart.products.map((prod) => {
            return (
              <div
                className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6 p-4 border-b"
                key={prod.p_id}
              >
                <div className="w-40 h-32 flex-shrink-0 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-lg font-medium">{prod.name}</div>
                </div>
                <div className="text-lg font-semibold">{prod.price}</div>
                <div className="flex items-center space-x-4">
                  <button className="px-3 py-1 border rounded">-</button>
                  <div className="text-lg font-medium">{prod.quantity}</div>
                  <button className="px-3 py-1 border rounded">+</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default MyCart;

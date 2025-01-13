import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "../Components/Loading";
import { useEffect } from "react";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
function MyOrders() {
  const orders = useSelector((state: RootState) => state.order);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyOrders(u_id));
  }, [dispatch, u_id]);

  if (orders.isloading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      {orders && orders.orders.length > 0 ? (
        orders.orders.map((ord) => {
          return (
            <div
              className="order card bg-base-100 shadow-md mb-4 p-6 rounded-lg w-full"
              key={ord.oi_id}
            >
              <div className="name text-lg font-semibold mb-2">{ord.name}</div>
              <div className="quantity mb-2">Quantity: {ord.quantity}</div>
              <div className="payment mb-2">Payment: {ord.payment}</div>
              <div className="delivery mb-4">
                Delivery Status: {ord.delivery}
              </div>
              <button className="btn btn-primary w-full">Make Payment</button>
            </div>
          );
        })
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">No orders available</p>
          <button onClick={() => navigate("/")} className="btn btn-secondary">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default MyOrders;

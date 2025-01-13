import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "../Components/Loading";
import { useEffect } from "react";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const { orders, isloading } = useSelector((state: RootState) => state.order);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyOrders(u_id));
  }, [dispatch, u_id]);

  if (isloading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div
            className="order card bg-base-100 shadow-md mb-6 p-6 rounded-lg w-full"
            key={order.o_id}
          >
            <div className="order-header mb-4">
              <h2 className="text-xl font-bold mb-2">Order ID: {order.o_id}</h2>
              <p className="text-lg">Total Price: ${order.total_price}</p>
              <p className="text-lg">Payment Status: {order.payment_status}</p>
              <p className="text-lg">Delivery Status: {order.delivery_status}</p>
            </div>
            <div className="order-products mb-4">
              <h3 className="text-lg font-semibold mb-2">Products:</h3>
              <ul className="list-disc list-inside">
                {order.products.map((product, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{product.product_name}</span> - 
                    Quantity: {product.quantity}, Price: ${product.price}
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn bg-red-900 w-full">Make Payment</button>
          </div>
        ))
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

import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import {
  approvePayment,
  fetchAllOrders,
} from "../../redux/slices/admin-slices/allorderSlice";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Components/Loading";

function AllOrders() {
  const { orders, isLoading } = useSelector(
    (state: RootState) => state.allorders
  );
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const approve_Payment = (o_id: number) => {
    dispatch(approvePayment(o_id));
  };

  if (isLoading) {
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
              <p className="text-lg">
                Delivery Status: {order.delivery_status}
              </p>
            </div>
            <div className="order-products mb-4">
              <h3 className="text-lg font-semibold mb-2">Products:</h3>
              <ul className="list-disc list-inside">
                {order.products.map((product, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-medium">{product.product_name}</span>{" "}
                    - Quantity: {product.quantity}, Price: ${product.price}
                  </li>
                ))}
              </ul>
            </div>
            <button
              disabled={order.payment_status == "approved"}
              onClick={() => approve_Payment(order.o_id)}
              className="btn bg-green-400 w-full text-gray-600"
            >
              Approve Payment
            </button>
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

export default AllOrders;

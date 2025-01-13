import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchMySales } from "../redux/slices/salesSlice";
import Loading from "../Components/Loading";

function MySales() {
  const sales = useSelector((state: RootState) => state.sale);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  useEffect(() => {
    dispatch(fetchMySales(u_id));
  }, [dispatch, u_id]);
  if (sales.isloading) {
    return <Loading />;
  }
  return (
    <div className="container">
      {sales.sales && sales.sales.length > 0 ? (
        sales.sales.map((item, index) => {
          return (
            <div
              className="order card bg-base-100 shadow-md mb-4 p-6 rounded-lg w-full"
              key={index}
            >
              <div className="name text-lg font-semibold mb-2">{item.name}</div>
              <div className="quantity mb-2">Quantity: {item.quantity}</div>
              <div className="payment mb-2">Payment: {item.payment}</div>
              <div className="delivery mb-4">
                Delivery Status: {item.delivery}
              </div>
              <button className="btn btn-primary w-full">
                Change delivery status
              </button>
            </div>
          );
        })
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">No sales available yet</p>
        </div>
      )}
    </div>
  );
}

export default MySales;

import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchMySales, updateDeliveryStatus } from "../redux/slices/salesSlice";
import Loading from "../Components/Loading";

function MySales() {
  const sales = useSelector((state: RootState) => state.sale);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const [selectedSale, setSelectedSale] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMySales(u_id));
  }, [dispatch, u_id]);

  const handleUpdateStatus = async (status: string) => {
    if (selectedSale) {
      await dispatch(updateDeliveryStatus({ oi_id: selectedSale, delivery: status }));
      setShowModal(false);
      setSelectedSale(null);
    }
  };

  if (sales.isloading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Sales</h1>
      {sales.sales && sales.sales.length > 0 ? (
        sales.sales.map((item) => (
          <div
            className="order card bg-base-100 shadow-md mb-4 p-6 rounded-lg w-full"
            key={item.oi_id}
          >
            <div className="name text-lg font-semibold mb-2">{item.name}</div>
            <div className="quantity mb-2">Quantity: {item.quantity}</div>
            <div className="payment mb-2">Payment: {item.payment}</div>
            <div className="delivery mb-4">
              Delivery Status: {item.delivery}
            </div>
            <button
              onClick={() => {
                setSelectedSale(item.oi_id);
                setShowModal(true);
              }}
              className="btn bg-red-900 w-full"
            >
              Change Delivery Status
            </button>
          </div>
        ))
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">No sales available yet</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
            <div className="space-y-2">
              {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className="btn btn-secondary w-full"
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-error mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySales;

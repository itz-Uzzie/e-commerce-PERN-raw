import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateProductQuantity } from "../redux/slices/orderDetailSlice";
import Toast from "../Components/Toast";

function OrderConfirmation() {
  const dispatch = useDispatch();
  const orderDetails = useSelector((state: RootState) => state.orderDetails);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  const handleQuantityChange = (p_id: number, newQuantity: number) => {
    dispatch(updateProductQuantity({ p_id, quantity: newQuantity }));
  };

  const prepareOrderPayload = () => {
    return {
      products: orderDetails.products.map((prod) => ({
        p_id: prod.p_id,
        quantity: prod.quantity,
      })),
      address: orderDetails.address,
    };
  };

  const handleConfirm = async () => {
    const payload = prepareOrderPayload();
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/order/placeorder/${u_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setToast({
          message: "Order placed successfully",
          type: "success",
        });
      } else {
        setToast({
          message: "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setToast({
        message: "Network error occurred",
        type: "error",
      });
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Address</h3>
        <p>{`${orderDetails.address?.area}, ${orderDetails.address?.city}, ${orderDetails.address?.country}`}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Products</h3>
        <ul>
          {orderDetails.products.map((prod) => (
            <li key={prod.p_id} className="flex items-center space-x-4">
              <span>{prod.name}</span>
              <span>${prod.price}</span>
              <input
                type="number"
                min="1"
                value={prod.quantity}
                onChange={(e) =>
                  handleQuantityChange(prod.p_id, Number(e.target.value))
                }
                className="w-16 px-2 py-1 border rounded"
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleConfirm}
        className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
      >
        Confirm Order
      </button>
    </div>
  );
}

export default OrderConfirmation;

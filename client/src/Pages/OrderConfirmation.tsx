import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateProductQuantity } from "../redux/slices/orderDetailSlice";
import Toast from "../Components/Toast";

function OrderConfirmation() {
  const dispatch = useDispatch();
  const orderDetails = useSelector((state: RootState) => state.orderDetails);
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

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

  const totalPrice = useMemo(
    () =>
      orderDetails.products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
    [orderDetails.products]
  );

  return (
    <div className="p-4 bg-gray-700 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <h2 className="text-2xl font-semibold mb-6 text-center">Order Confirmation</h2>
      <div className="bg-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
        <p className="text-gray-400">{`${orderDetails.address?.area}, ${orderDetails.address?.city}, ${orderDetails.address?.country}`}</p>
      </div>
      <div className="bg-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Products</h3>
        <ul className="divide-y divide-gray-200">
          {orderDetails.products.map((prod) => (
            <li key={prod.p_id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{prod.name}</p>
                <p className="text-sm text-gray-400">${prod.price} each</p>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={prod.quantity}
                  onChange={(e) =>
                    handleQuantityChange(prod.p_id, Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 border rounded text-center"
                />
                <p className="font-medium text-gray-500">
                  ${prod.quantity * prod.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-black shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium">Total Price</h3>
        <p className="text-xl font-semibold text-gray-400">
          ${totalPrice}
        </p>
      </div>
      <button
        onClick={handleConfirm}
        className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 transition duration-300"
      >
        Confirm Order
      </button>
    </div>
  );
}

export default OrderConfirmation;

import Loading from "../../Components/Loading";
import Address from "../../Components/Address";
import { RootState } from "../../redux/store";
import { fetchCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { setOrderDetails } from "../../redux/slices/orderDetailSlice";
import { useEffect, useState } from "react";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

function MyCart() {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.decodeduser);
  const address = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  console.log(address);

  const [isModel, setIsModel] = useState(false);
  const [isAddressModal, setisAddressModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchCart(user.u_id));
  }, [dispatch, user]);

  const handleCheckboxChange = (p_id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(p_id) ? prev.filter((id) => id !== p_id) : [...prev, p_id]
    );
  };

  const handleCheckout = () => {
    const selectedItems = cart.products.filter((prod) =>
      selectedProducts.includes(prod.p_id)
    );

    if (!address.address) {
      alert("Please add an address before proceeding.");
      return;
    }

    const orderDetails = {
      address: address.address,
      products: selectedItems.map((prod) => ({
        p_id: prod.p_id,
        name: prod.name,
        price: prod.price,
        quantity: prod.quantity,
      })),
    };
    dispatch(setOrderDetails(orderDetails));
    navigate("/orderCheckout");
  };

  if (cart.isloading) {
    return <Loading />;
  }

  return (
    <div className="container flex flex-col items-center w-full px-4 md:px-10">
      <div className="text-center my-6">
        <h2 className="text-2xl font-semibold">All Products</h2>
      </div>
      <button
        className="mb-4 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
        onClick={() => setisAddressModal(!isAddressModal)}
      >
        Add address
      </button>
      {isAddressModal && <Address />}
      <button
        className="mb-4 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
        onClick={() => setIsModel(!isModel)}
      >
        Select to Order
      </button>
      <div className="flex flex-col w-full md:w-3/4 p-4 space-y-6">
        {cart.products.length > 0 &&
          cart.products.map((prod) => (
            <div
              className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6 p-4 border-b"
              key={prod.p_id}
            >
              {isModel && (
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(prod.p_id)}
                  onChange={() => handleCheckboxChange(prod.p_id)}
                  className="mr-4"
                />
              )}
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
                <div className="text-lg font-medium">{prod.quantity}</div>
              </div>
            </div>
          ))}
      </div>
      {isModel && (
        <button
          className="mt-6 bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
          onClick={handleCheckout}
        >
          Checkout Now
        </button>
      )}
    </div>
  );
}

export default MyCart;

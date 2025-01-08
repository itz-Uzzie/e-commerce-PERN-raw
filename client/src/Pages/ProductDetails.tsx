import { useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import Toast from "../Components/Toast";

interface Product {
  p_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
}

const ProductDetails = () => {
  const [isModal, setisModal] = useState(false);
  const [resultData, setresultData] = useState("");
  const [loginModal, setloginModal] = useState(false);
  const [currentImg, setcurrentImg] = useState(0);
  const product: Product | null = JSON.parse(
    localStorage.getItem("product") || "null"
  );
  const user = useSelector((state: RootState) => state.user.decodeduser);

  const add_to_cart = async () => {
    if (!user.u_id) {
      setTimeout(() => {
        setloginModal(false);
      }, 2000);
      return setloginModal(!loginModal);
    } else {
      const response = await fetch(
        `http://localhost:4000/api/v1/cart/addtocart/${user.u_id}/${product?.p_id}`,
        { method: "POST" }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setresultData(result);
        setTimeout(() => {
          setisModal(false);
        }, 2000);
        setisModal(true);
      }
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-bold">No product details available</h2>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {isModal && <Toast message={resultData} type={"success"} />}
      {loginModal && <Toast message={"Login first"} type={"info"} />}
      <div className="flex flex-col lg:flex-row md:flex-row gap-4">
        <div className="w-full lg:w-3/4 aspect-square bg-slate-900 flex items-center justify-center rounded-md overflow-hidden">
          {product.images.length > 0 ? (
            <img
              src={product.images[currentImg]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
              <p>No Image Available</p>
            </div>
          )}
        </div>

        <div className="flex lg:flex-col md:flex-col gap-2 overflow-x-auto lg:w-1/4 md:w-1/4">
          {product.images.map((img, index) => (
            <div
              key={index}
              className={`w-24 h-24 flex items-center justify-center rounded-md overflow-hidden cursor-pointer ${
                currentImg === index ? "border-2 border-emerald-500" : ""
              }`}
              onClick={() => setcurrentImg(index)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-lg font-bold">{product.name}</h1>
        <p className="text-md text-gray-600 mt-2">{product.description}</p>
        <p className="text-lg font-semibold text-emerald-600 mt-4">
          ${product.price}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <button
          className="mt-6 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          onClick={() => add_to_cart()}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

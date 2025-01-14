import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchdetails } from "../../redux/slices/productSlice";

interface p {
  p_id: number;
  name: string;
  price: number;
  images: string;
}

interface ProductCardProps {
  product: p;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const navigate = useNavigate();

  const handleClick = async () => {
    await dispatch(fetchdetails(product.p_id));
    navigate(`/product/${product.p_id}`);
  };

  return (
    <div
      className="bg-slate-800 text-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 hover:transition"
      onClick={handleClick}
    >
      <img
        src={product.images}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-300">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

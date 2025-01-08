import Loading from "../Components/Loading";
import ProductCard from "./ProductCard";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const ProductList = () => {
  const product = useSelector((state: RootState) => state.product);
  const isloading = product.isloading;
  if (isloading) {
    return <Loading />;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-8 container mx-auto">
      {product.products.length > 0 &&
        product.products.map((product) => (
          <ProductCard key={product.p_id} product={product} />
        ))}
    </div>
  );
};

export default ProductList;

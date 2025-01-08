import React, { useState } from "react";
import Loading from "../Components/Loading";
import { RootState } from "../redux/store";
import { Suspense, useEffect } from "react";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, resetProducts } from "../redux/slices/productSlice";
const ProductList = React.lazy(() => import("./ProductList"));

const Home = () => {
  const categories = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const [selectedCategory, setselectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(
      fetchProducts({ ct_id: selectedCategory, page: currentPage})
    );
  }, [dispatch, selectedCategory, currentPage]);

  const handleCategoryClick = (ct_id: number) => {
    setselectedCategory(ct_id);
    setCurrentPage(1);
    dispatch(resetProducts());
    dispatch(fetchProducts({ ct_id, page: 0 }));
  };

  if (categories.isloading) {
    return <Loading />;
  }
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="py-12">
        <div className="grid grid-cols-3 md:grid-cols-4 px-8 gap-2 container mx-auto">
          {categories.categories.length > 0 &&
            categories.categories.map((cat) => {
              return (
                <h3
                  key={cat.ct_id}
                  className={`text-l font-bold mb-8 border-gray-600 ${
                    selectedCategory === cat.ct_id ? "underline" : ""
                  }`}
                  onClick={() => handleCategoryClick(cat.ct_id)}
                >
                  {cat.name}
                </h3>
              );
            })}
        </div>
        <Suspense fallback={<Loading />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
};

export default Home;

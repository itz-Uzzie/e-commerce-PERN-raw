import { useSelector } from "react-redux";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

interface ProductFormData {
  ct_id: number;
  name: string;
  price: string;
  stock: string;
  description: string;
  images: File[];
}

const initialFormState: ProductFormData = {} as ProductFormData;

function AddProduct() {
  const navigate = useNavigate();
  const u_id = useSelector((state: RootState) => state.user.decodeduser.u_id);
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const [productData, setProductData] =
    useState<ProductFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement & {
      files: FileList;
    };
    if (name === "images" && files) {
      const selectedImages = Array.from(files).slice(0, 5);
      setProductData((prevData) => ({
        ...prevData,
        images: selectedImages,
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("ct_id", productData.ct_id.toString());
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("description", productData.description);
      productData.images.forEach((img) => formData.append("images", img));

      const response = await fetch(
        `http://localhost:4000/api/v1/product/new/${u_id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to add product");
      }
    } catch (error) {
      setError("Network error occurred. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto p-6 bg-black rounded-lg shadow-md">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            name="ct_id"
            id="category"
            value={productData.ct_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select Category</option>
            {categories.length > 0 &&
              categories.map((cat: { ct_id: number; name: string }) => (
                <option key={cat.ct_id} value={cat.ct_id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="mt-1 block w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Product Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Product Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={productData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium">
            Upload Images (Max 5)
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || !productData.ct_id}
            className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700"
          >
            {isLoading ? "Submitting..." : "Add Product"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

export default AddProduct;

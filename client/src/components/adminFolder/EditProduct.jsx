import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
function EditProduct() {
  const location = useLocation();
  const selectedProduct = location.state.selectedProduct || "";
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: selectedProduct.title || "",
    description: selectedProduct.description || "",
    price: selectedProduct.price || "",
    category: selectedProduct.category || "",
    brand: selectedProduct.brand || "",
    thumbnail: selectedProduct.thumbnail || "",
    images: selectedProduct.images || [""],
    stock: selectedProduct.stock || "",
    discountPercentage: selectedProduct.discountPercentage || 0,
    ...selectedProduct,
  });

  const [details, setDetails] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleImageChange = (index, value) => {
    const newImages = [...product.images];
    newImages[index] = value;
    setProduct({ ...product, images: newImages });
  };
  const handleAddImage = () => {
    setProduct({ ...product, images: [...product.images, ""] });
  };
  const handleRemoveImage = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedImages = product.images.filter(
        (image) => image.trim() !== ""
      );
      const updatedProduct = { ...product, images: updatedImages };
      //   console.log("updatedProduct", updatedProduct);
      axios.defaults.withCredentials = true;
      const id = updatedProduct._id;
      const response = await axios.put(
        `${process.env.REACT_APP_HOST_URL}/product/updateProduct/${id}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === true) {
        console.log("response", response.data);
        toast.success("Product Updated Successfully");
        setDetails("Product Updated Successfully");
        setTimeout(() => {
          navigate("/user/admin/allProducts");
        }, 3000);
      } else {
        console.log(response.data.message);
        setDetails(response.data.message);
      }
    } catch (error) {
      console.error("Error in saving/sending data:", error);
      setDetails("Error: Failed to update product.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer/>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="addForm">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="brand"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="thumbnail"
            >
              Thumbnail URL
            </label>
            <input
              type="text"
              id="thumbnail"
              name="thumbnail"
              value={product.thumbnail}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="images"
            >
              Images URLs
            </label>
            {product.images.map((image, index) => (
              <div key={index} className="flex items-center mb-2 ">
                {<p className="pr-2">{index + 1}</p>}
                <input
                  type="text"
                  id={`image-${index}`}
                  name={`image-${index}`}
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              disabled={product.images[product.images.length - 1] === ""}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Another Image
            </button>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="stock"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="discountPercentage"
            >
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={product.discountPercentage}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             
            />
          </div>
          {details}
          <div className="flex items-center justify-between ">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update {selectedProduct.title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;

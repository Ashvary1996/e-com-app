import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/product/getAllProducts`
      );
      setProducts(response.data.items);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_HOST_URL}/product/deleteProduct/${productId}`
      );
      console.log("deleted ", productId);
      toast.warn("Product-Deleted Successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    navigate(`/user/admin/editProduct/${product._id}`, {
      state: { selectedProduct: product },
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const sortedProducts = () => {
    if (sortBy === "Title") {
      return [...products].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Price") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Stock") {
      return [...products].sort((a, b) => a.stock - b.stock);
    }
    return products;
  };

  const filteredProducts = sortedProducts().filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 border-2    ">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search Products"
            value={searchTerm}
            onChange={handleSearch}
            className="text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSort("Title")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sort by Title
          </button>
          <button
            onClick={() => handleSort("Price")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sort by Price
          </button>
          <button
            onClick={() => handleSort("Stock")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sort by Stock
          </button>
        </div>
      </div>
      <div className=" h-[60vh]   overflow-scroll">
        <table className="min-w-full bg-white  ">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S.no</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Edit</th>
              <th className="py-2 px-4 border-b">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, i) => (
              <tr key={product._id} className="hover:bg-gray-200">
                <td className="py-2 px-4 border-b">{i + 1}</td>
                <td className="py-2 px-4 border-b">{product.title}</td>
                <td className="py-2 px-4 border-b">
                  ₹ {product.price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.stock}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        `Are you sure you want to delete this product: ${product.title}?`
                      );
                      if (confirmDelete) {
                        handleDelete(product._id);
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;

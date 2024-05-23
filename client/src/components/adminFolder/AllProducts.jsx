import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  // const [editedProduct, setEditedProduct] = useState(null);
  // const [isEditOpen, setIsEditOpen] = useState(false);
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
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product) => {
    console.log(product);
    // navigate("/addProduct", { selectedProduct: product });
    navigate(`/user/admin/editProduct/${product._id}`, {
      state: { selectedProduct: product },
    });
    // setEditedProduct(product);
    // setIsEditOpen(true);
    // console.log("Edit product with ID:", product);
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
    <div className="allProductAdminTable">
      <h1>Product List</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="sort-buttons">
        <button onClick={() => handleSort("Title")}>Sort by Title</button>
        <button onClick={() => handleSort("Price")}>Sort by Price</button>
        <button onClick={() => handleSort("Stock")}>Sort by Stock</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Title</th>
            {/* <th>Description</th> */}
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, i) => (
            <tr key={product._id} className="hover:bg-slate-500">
              <td>{i + 1}</td>
              <td>{product.title}</td>
              {/* <td>{product.description}</td> */}
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                {/* <Link to="editProduct" className="block hover:underline">
                 Eddd
                </Link> */}
              </td>
              <td>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete this product : ${
                        i + 1
                      }, ${product.title}?`
                    );
                    if (confirmDelete) {
                      handleDelete(product._id);
                      alert(
                        `Product listed on ${i + 1}, ${
                          product.title
                        } deleted successfully!`
                      );
                    }
                  }}
                >
                  Delete
                </button>

                {/* Display product image here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProducts;

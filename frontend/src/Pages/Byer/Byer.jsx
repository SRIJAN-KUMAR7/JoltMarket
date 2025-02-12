import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartManager/CartManager";
import { toast } from "react-toastify";

function Byer() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("You have been logged out");
    window.location.reload();
  };

  const handleCart = () => {
    navigate("/Cart");
  };

  const addCart = (index) => {
    addToCart(filteredProducts[index]);
    toast.success("Item added to cart successfully");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://backjolt-1.onrender.com/product/entries");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on price, name, and category
    const filtered = products.filter((product) => {
      const price = parseFloat(product.price);
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      const matchesPrice = price >= min && price <= max;

      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.productCategory === selectedCategory;

      return matchesPrice && matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, searchTerm, selectedCategory, products]);

  return (
    <div
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
      className="dark:bg-black"
    >
      <section className="mt-[20px] text-center">
        <h1 className="font-medium text-3xl mb-8 text-slate-700 dark:text-white">
          Featured Products
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 dark:text-white">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-4 py-2 rounded-md dark:text-white"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(products.map((p) => p.productCategory))).map(
              (category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        {/* Product List */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
            {filteredProducts.map((product, index) => (
              <div
                className="bg-white shadow-md rounded-lg p-4 flex flex-col dark:bg-gray-700"
                key={index}
              >
                <div className="w-full h-48 mb-2 overflow-hidden dark:text-white">
                  {product.image ? (
                    <img
                      className="w-full h-full object-contain object-center"
                      src={product.image}
                      alt={product.productName}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={`https://placehold.co/800?text=${product.productName}&font=roboto`}
                      className="w-full h-full object-contain object-center"
                      alt={product.productName}
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-left text-gray-700 dark:text-white">
                  {product.productName}
                </h3>
                <p className="text-gray-600 mb-2 text-left line-clamp-2 dark:text-white">
                  {product.productDetails}
                </p>
                <div className="text-xl font-bold mb-2 text-left text-gray-700 dark:text-white">
                  ₹{product.price}
                </div>
                <button
                  onClick={() => addCart(index)}
                  className="bg-[#3b1c80] text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full mt-auto dark:bg-blue-500 dark:hover:bg-[#1321DE]"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Byer;

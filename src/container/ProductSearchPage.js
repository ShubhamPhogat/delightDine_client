import React from "react";
import UseProductSearch from "../components/UseProductSearch";
import Headers from "../components/Headers";
import { addNewItemToCart, getAllCartItems } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import Cart from "../components/Cart";

const ProductSearchPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    selectedProduct,
    similarProducts,
    isLoading,
    isDropdownOpen,
    handleProductSelect,
  } = UseProductSearch(200); // 200ms debounce

  const user = useSelector((state) => state.user);
  const isCart = useSelector((state) => state.isCart);

  const dispatch = useDispatch();

  // Add to cart function
  const sendToCart = async (productId) => {
    try {
      if (!user?._id) {
        console.error("No user ID available");
        return;
      }

      const updatedCartItem = await addNewItemToCart(user._id, productId);
      if (!updatedCartItem) {
        console.error("Failed to add item to cart");
        return;
      }

      console.log("in"); // This should now log if we get here
      const cartItems = await getAllCartItems(user._id);

      if (cartItems) {
        console.log("cart items");
        console.log(cartItems.data);
        dispatch(setCartItems(cartItems.data));
      }

      dispatch(alertSuccess(`Item added to the cart`));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } catch (error) {
      console.error("Error in sendToCart:", error);
      // You might want to dispatch an error alert here
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Space for navbar */}
      <div className="h-16">
        <Headers />
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-5">
        <div className="relative">
          <div className="flex items-center w-full">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
            <button className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductSelect(product)}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-gray-800">{product.productName}</p>
                </div>
              ))}
            </div>
          )}

          {isLoading && searchTerm && (
            <div className="absolute right-16 top-3.5">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-orange-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Product Display Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {selectedProduct ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Selected Product
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-8">
                  <img
                    src={
                      selectedProduct.productImage ||
                      "https://via.placeholder.com/300"
                    }
                    alt={selectedProduct.productName}
                    className="w-full h-64 object-contain"
                  />
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">
                    {selectedProduct.productCategory || "Category"}
                  </div>
                  <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    {selectedProduct.productName}
                  </h1>
                  <div className="mt-4 flex items-center">
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{selectedProduct.productPrice?.toFixed(2) || "0.00"}
                    </span>
                    {selectedProduct.oldPrice && (
                      <span className="ml-2 text-gray-500 line-through">
                        ₹{selectedProduct.oldPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium">
                        Availability:
                      </span>
                      <span
                        className={`ml-2 ${
                          selectedProduct.productStock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedProduct.productStock > 0
                          ? `In Stock (${selectedProduct.productStock})`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-gray-600 text-sm">
                      {selectedProduct.productDescription ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => sendToCart(selectedProduct._id)}
                      disabled={selectedProduct.productStock <= 0}
                      className={`px-6 py-3 rounded-lg font-medium text-white transition duration-200 ${
                        selectedProduct.productStock > 0
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-orange-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Search for a product
            </h2>
            <p className="text-gray-500 max-w-md mt-2">
              Enter a product name in the search bar above to see details and
              similar products
            </p>
          </div>
        )}

        {/* Similar Products Section */}
        {similarProducts.length > 0 && selectedProduct && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => handleProductSelect(product)}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-200 cursor-pointer"
                >
                  <div className="p-4 bg-gray-50 flex items-center justify-center h-48">
                    <img
                      src={
                        product.productImage ||
                        "https://via.placeholder.com/150"
                      }
                      alt={product.productName}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.productName}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{product.productPrice?.toFixed(2) || "0.00"}
                      </span>
                      <span
                        className={`text-sm ${
                          product.productStock > 0
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {product.productStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>{isCart && <Cart />}</div>
    </div>
  );
};

export default ProductSearchPage;

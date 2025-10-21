import { useState, useEffect, useRef } from "react";
import axios from "axios";

/**
 * Custom hook for product search functionality
 * @param {number} debounceTime - Debounce time in milliseconds
 * @returns {Object} - Search state and functions
 */
const UseProductSearch = (debounceTime = 200) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchTimeout = useRef(null);

  // Search for products as user types
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        setIsLoading(true);

        // Replace with your actual API endpoint
        axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/api/product/search/${searchTerm}`)
          .then((response) => {
            console.log(response);
            setSearchResults(response.data);
            setIsDropdownOpen(true);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error searching products:", error);
            setIsLoading(false);
          });
      }, debounceTime);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }

    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm, debounceTime]);

  // Fetch similar products when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      // Replace with your actual API endpoint
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/product/matching/${selectedProduct._id}`
        )
        .then((response) => {
          console.log("matching products", response);
          setSimilarProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching similar products:", error);
        });
    }
  }, [selectedProduct]);

  // Handle product selection
  const handleProductSelect = (product) => {
    setIsLoading(true);
    setIsDropdownOpen(false);

    // Replace with your actual API endpoint
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/product/findById/${product._id}`)
      .then((response) => {
        console.log(response);
        setSelectedProduct(response.data);
        setIsLoading(false);
        setSearchTerm(""); // Clear search after selection
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setIsLoading(false);
      });
  };

  // Clear search and selection
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    selectedProduct,
    similarProducts,
    isLoading,
    isDropdownOpen,
    handleProductSelect,
    clearSearch,
  };
};

export default UseProductSearch;

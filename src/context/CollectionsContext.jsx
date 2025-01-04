// CollectionsContext.js
import React, { createContext, useState, useContext, useCallback } from "react";

const CollectionsContext = createContext({
  CollectionsData: {},
  isLoading: false,
  error: null,
  fetchCollections: () => {},
  // search: "",
  // setSearch: () => {},
  // showSearch: false,
  // setShowSearch: () => {},
  fetchAllProducts: () => {},
  fetchProducts: () => {},
  fetchSpecificProduct: () => {},
  calculateReview: () => {},
});

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};

export const colorMap = {
  Yl: "bg-yellow-400",
  Wh: "bg-white",
  BB: "bg-blue-200",
  SG: "bg-gray-400",
  Sb: "bg-sky-400",
  Rb: "bg-blue-600",
  Rd: "bg-red-500",
  Pu: "bg-purple-500",
  Pb: "bg-blue-800",
  Ph: "bg-orange-200",
  Or: "bg-orange-500",
  OG: "bg-olive-600",
  NYl: "bg-yellow-300",
  Nb: "bg-navy-800",
  MYl: "bg-yellow-600",
  Mh: "bg-stone-400",
  Mnt: "bg-green-200",
  Mn: "bg-red-800",
  LBp: "bg-pink-200",
  Lv: "bg-purple-200",
  Jd: "bg-emerald-400",
  Gm: "bg-gray-300",
  GYl: "bg-yellow-500",
  Fgn: "bg-green-600",
  Cor: "bg-orange-400",
  Cop: "bg-amber-600",
  Bn: "bg-brown-700",
  Cm: "bg-gray-600",
  BRd: "bg-red-700",
  Gn: "bg-green-800",
  Bk: "bg-black",
  Be: "bg-amber-100",
  Fl: "bg-pink-500",
};

export const CollectionsProvider = ({ children }) => {
  const [CollectionsData, setCollectionsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [search, setSearch] = useState("");
  // const [showSearch, setShowSearch] = useState(false);

  const fetchCollections = useCallback(async () => {
    // console.log("Fetching collections started...");
    if (CollectionsData && Object.keys(CollectionsData).length > 0) {
      // console.log("CollectionsData already exists:", CollectionsData);
      console.log("CollectionsData already exists: ------>>");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/subcategories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const { success, data } = await response.json();
      // console.log("API Response - success:", success);
      // console.log("API Response - data:", data);

      if (!success) {
        throw new Error("API returned unsuccessful response");
      }

      setCollectionsData(data);
      // console.log("CollectionsData has been set:", data);
    } catch (err) {
      console.error("Error in fetchCollections:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      // console.log("Loading state set to false");
    }
  }, []);

  const fetchProducts = useCallback(async (category, subCategory) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/products/${category}/${subCategory}`
      );
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  });

  const fetchSpecificProduct = async (productID) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/product/${productID}`
      );
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.log("error while fetching product data");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/products");
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateReview = (product) => {
    let totalReviews = 0; // Use let instead of const
    for (let i = 0; i < product.reviews.length; i++) {
      totalReviews += product.reviews[i].rating;
    }

    const review = Math.floor(Number(totalReviews / product.reviews.length));
    return [review, 5 - review];
  };

  const value = {
    CollectionsData,
    isLoading,
    error,
    fetchCollections,
    // search,
    // setSearch,
    // showSearch,
    // setShowSearch,
    fetchProducts,
    fetchAllProducts,
    fetchSpecificProduct,
    calculateReview,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

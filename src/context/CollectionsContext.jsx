// CollectionsContext.js
import React, { createContext, useState, useContext, useCallback } from "react";
import { BASE_URL } from "../server/server";

const CollectionsContext = createContext({
  CollectionsData: {},
  isLoading: false,
  error: null,
  fetchCollections: () => {},
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
  Yl: "bg-[#facc15]",
  Wh: "bg-[#ffffff]",
  BB: "bg-[#87CEEB]",
  SG: "bg-[#9ca3af]",
  Sb: "bg-[#38bdf8]",
  Rb: "bg-[#2563eb]",
  Rd: "bg-[#ef4444]",
  Pu: "bg-[#a855f7]",
  pb: "bg-[#0C5678]",
  Ph: "bg-[#fed7aa]",
  or: "bg-[#f97316]",
  OG: "bg-[#3d550c]", // olive alternative
  NYI: "bg-[#fde047]",
  Nb: "bg-[#1e40af]",
  MYI: "bg-[#ca8a04]",
  Mh: "bg-[#a8a29e]",
  Mnt: "bg-[#bbf7d0]",
  Mn: "bg-[#7f1d1d]",
  LBp: "bg-[#fbcfe8]",
  Lv: "bg-[#e9d5ff]",
  Jd: "bg-[#34d399]",
  Gm: "bg-[#d1d5db]",
  GYI: "bg-[#f59e0b]",
  Fgn: "bg-[#16a34a]",
  Cor: "bg-[#ed7364]",
  Cop: "bg-[#d97706]",
  bn: "bg-[#431407]", // brown alternative
  Cm: "bg-[#4b5563]",
  BRd: "bg-[#b91c1c]",
  Gn: "bg-[#065f46]",
  Bk: "bg-[#000000]",
  Be: "bg-[#fef3c7]",
  Fl: "bg-[#ec4899]",
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
      // console.log("CollectionsData already exists: ------>>");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/subcategories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

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
        `${BASE_URL}/api/v1/products/${category}/${subCategory}`
      );
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  });

  const fetchSpecificProduct = async (productID) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/product/${productID}`);
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.log("error while fetching product data");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/products`);
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
    fetchProducts,
    fetchAllProducts,
    fetchSpecificProduct,
    calculateReview,
    colorMap,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

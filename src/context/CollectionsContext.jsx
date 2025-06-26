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
  Cor: "bg-[#f08080]",
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
  const fetchProductColorImages = async (productId, colorCode) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/product/${productId}/color/${colorCode}`
      );
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          images: data.images,
          colorCode: data.colorCode,
          totalImages: data.totalImages,
        };
      } else {
        console.error("Error fetching color images:", data.message);
        return {
          success: false,
          message: data.message,
          availableColors: data.availableColors || [],
        };
      }
    } catch (error) {
      console.error("Error while fetching color images:", error);
      return {
        success: false,
        message: "Network error while fetching images",
      };
    }
  };

  const fetchAllProductColorImages = async (productId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/product/${productId}/colors`
      );
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          colorImages: data.colorImages, // Object with color codes as keys and image arrays as values
          availableColors: data.availableColors, // Array of available color codes
          totalColors: data.totalColors,
        };
      } else {
        console.error("Error fetching all color images:", data.message);
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Error while fetching all color images:", error);
      return {
        success: false,
        message: "Network error while fetching color images",
      };
    }
  };

  const fetchSpecificProduct = async (productID) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/product/${productID}?includeRecommendations=true`
      );
      const data = await response.json();
      return data;
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

  // Helper function to get available colors for a product
  const getProductAvailableColors = (product) => {
    if (product.colorImages && Array.isArray(product.colorImages)) {
      return product.colorImages.map((entry) => entry.color);
    }
    return product.color || []; // Fallback to the main color field
  };

  // Helper function to get image count for a specific color
  const getColorImageCount = (product, colorCode) => {
    if (product.colorImageCounts) {
      return product.colorImageCounts[colorCode] || 0;
    }

    // Fallback: count from colorImages array
    if (product.colorImages && Array.isArray(product.colorImages)) {
      const colorEntry = product.colorImages.find(
        (entry) => entry.color === colorCode
      );
      return colorEntry ? colorEntry.images.length : 0;
    }

    return 0;
  };

  // Helper function to get all color-image mappings from a product
  const getProductColorMappings = (product) => {
    if (product.colorImages && Array.isArray(product.colorImages)) {
      const mappings = {};
      product.colorImages.forEach((entry) => {
        mappings[entry.color] = entry.images;
      });
      return mappings;
    }
    return {};
  };

  const calculateReview = (product) => {
    let totalReviews = 0; // Use let instead of const
    for (let i = 0; i < product.reviews.length; i++) {
      totalReviews += product.reviews[i].rating;
    }

    const review = Number(totalReviews / product.reviews.length);
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
    fetchProductColorImages,
    fetchAllProductColorImages,
    getProductAvailableColors,
    getColorImageCount,
    getProductColorMappings,
    calculateReview,
    colorMap,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

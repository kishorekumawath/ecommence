// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./NewAuthContext";
import { BASE_URL } from "../server/server";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  const { user, apiCall, logout } = useAuth();

  // Fetch wishlist items
  const fetchWishlist = async (userData = null) => {
    const currentUser = userData || user;

    if (!currentUser?._id) {
      console.log("No user data available");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiCall("/api/v1/wishlist", {
        method: "POST",
        body: JSON.stringify({ userId: currentUser._id }),
      });

      if (response.success) {
        // Filter out any items with null/undefined products
        const validItems = (response.data.products || []).filter(
          (item) => item?.product?._id
        );
        setWishlistItems(validItems);
      } else {
        throw new Error(response.message || "Failed to fetch wishlist");
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      if (err.message.includes("token")) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError(err.message);
      }
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch wishlist when user or token changes
  useEffect(() => {
    if (user?._id && token) {
      fetchWishlist(user);
    } else {
      setError("User not authenticated");
      setWishlistItems([]);
    }
  }, [user, token]);

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("Please log in to add to wishlist");
      }
      const response = await fetch(`${BASE_URL}/api/v1/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, userId: user?._id }),
      });
      const data = await response.json();

      if (data.success) {
        // Filter out any items with null/undefined products
        const validItems = (data.data.products || []).filter(
          (item) => item?.product?._id
        );
        setWishlistItems(validItems);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user?._id) {
      throw new Error("Please log in to remove from wishlist");
    }

    // Store current items for rollback
    const previousItems = [...wishlistItems];

    // Optimistic update with null check
    setWishlistItems((items) =>
      items.filter(
        (item) => item?.product?._id && item.product._id !== productId
      )
    );

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/wishlist/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        }
      );
      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setWishlistItems(previousItems);
        throw new Error(data.message);
      }
    } catch (err) {
      // Revert on error
      setWishlistItems(previousItems);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/wishlist/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setWishlistItems([]);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item?.product?._id === productId);
  };

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for using wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

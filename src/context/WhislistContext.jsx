// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have AuthContext

const WishlistContext = createContext();

const BASE_URL = 'http://localhost:9000';

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token=localStorage.getItem("accessToken")

    const {user}=useAuth()

    
    // Fetch wishlist items
    const fetchWishlist = async (userData) => {
        console.log("Fetching wishlist");
        console.log("Token",token)
        if (!token) return;
        
        console.log("user --->---",JSON.stringify({'userId':userData._id}));
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:9000/api/v1/wishlist`,  {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  "Content-Type": "application/json",
                },
                body: {"userId":userData._id},
              });
            const data = await response.json();
          
            console.log("Whislist",data)
            if (data.success) {
                setWishlistItems(data.data.products || []);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.log("Error",err)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add item to wishlist
    const addToWishlist = async (productId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/v1/wishlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            
            if (data.success) {
                setWishlistItems(data.data.products);
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

    // Remove item from wishlist
    const removeFromWishlist = async (productId) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/v1/wishlist/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setWishlistItems(data.data.products);
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

    // Clear wishlist
    const clearWishlist = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/v1/wishlist/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        return wishlistItems.some(item => item.product._id === productId);
    };

    // Fetch wishlist on mount and token change
    // useEffect(() => {
    //     fetchWishlist();
    // }, [token]);

    const value = {
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        fetchWishlist
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
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
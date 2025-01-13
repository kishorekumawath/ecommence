import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
  } from "react";
  import { useAuth } from "./AuthContext";
  import { useNavigate } from "react-router-dom";
  
  const CartContext = createContext({
    cart: {},
    isLoading: false,
    error: null,
    addToCart: async () => {},
    updateQuantity: async () => {},
    removeCartItem: async () => {},
    clearCart: () => {},
    getCartCount: () => 0,
    getCartAmount: () => 0,
    syncCart: async () => {},
  });
  
  // Secure storage wrapper for consistent error handling
  const SecureStorage = {
    setItem: (key, value) => {
      try {
        localStorage.setItem(
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        );
        return true;
      } catch (error) {
        console.error(`Error storing ${key}:`, error);
        return false;
      }
    },
    getItem: (key, parse = false) => {
      try {
        const item = localStorage.getItem(key);
        return parse && item ? JSON.parse(item) : item;
      } catch (error) {
        console.error(`Error retrieving ${key}:`, error);
        return null;
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing ${key}:`, error);
        return false;
      }
    },
  };
  
  // Helper function to get storage key for a user
  const getStorageKey = (userId) => `cart_${userId || "anonymous"}`;
  
  export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Load cart from storage on mount and user change
    useEffect(() => {
      const loadCart = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const storageKey = getStorageKey(user?._id);
          const savedCart = SecureStorage.getItem(storageKey, true) || {};
          
          if (isAuthenticated && Object.keys(savedCart).length === 0) {
            // Try to fetch cart from backend if available
            await syncCart();
          } else {
            setCart(savedCart);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
          setError("Failed to load cart");
        } finally {
          setIsLoading(false);
        }
      };
  
      loadCart();
    }, [user?._id, isAuthenticated]);
  
    // Save cart to storage whenever it changes
    const saveCart = useCallback(async (newCart) => {
      try {
        setError(null);
        const storageKey = getStorageKey(user?._id);
        const saved = SecureStorage.setItem(storageKey, newCart);
        
        if (!saved) {
          throw new Error("Failed to save cart to storage");
        }
  
        // If user is authenticated, sync with backend
        if (isAuthenticated) {
          // Implement API call to sync cart with backend
          await syncCart();
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        setError("Failed to save cart");
        throw error;
      }
    }, [user?._id, isAuthenticated]);
  
    const syncCart = useCallback(async () => {
      // Implement backend sync logic here if needed
      // This would make an API call to sync the cart with the backend
      return Promise.resolve();
    }, []);
  
    const addToCart = useCallback(async (id, size, color, product) => {
      try {
        setError(null);
        if (!id || !size || !color || !product) {
          throw new Error("Invalid product details");
        }
  
        const copyCart = structuredClone(cart);
        
        if (!copyCart[id]) {
          copyCart[id] = [];
        }
  
        const existingItemIndex = copyCart[id].findIndex(
          (item) => item.size === size && item.color === color
        );
  
        if (existingItemIndex !== -1) {
          copyCart[id][existingItemIndex].quantity += 1;
        } else {
          copyCart[id].push({
            size,
            color,
            quantity: 1,
            product: {
              ...product,
              id: product.id || id, // Ensure product has an id
            },
          });
        }
  
        setCart(copyCart);
        await saveCart(copyCart);
        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);
        setError(error.message || "Failed to add item to cart");
        return false;
      }
    }, [cart, saveCart]);
  
    const updateQuantity = useCallback(async (id, size, color, quantity) => {
      try {
        setError(null);
        if (!id || !size || !color || typeof quantity !== 'number' || quantity < 0) {
          throw new Error("Invalid update parameters");
        }
  
        const copyCart = structuredClone(cart);
        
        if (!copyCart[id]) {
          throw new Error("Product not found in cart");
        }
  
        const itemIndex = copyCart[id].findIndex(
          (item) => item.size === size && item.color === color
        );
  
        if (itemIndex === -1) {
          throw new Error("Item variant not found in cart");
        }
  
        if (quantity === 0) {
          copyCart[id] = copyCart[id].filter((_, index) => index !== itemIndex);
          if (copyCart[id].length === 0) {
            delete copyCart[id];
          }
        } else {
          copyCart[id][itemIndex].quantity = quantity;
        }
  
        setCart(copyCart);
        await saveCart(copyCart);
        return true;
      } catch (error) {
        console.error("Error updating quantity:", error);
        setError(error.message || "Failed to update quantity");
        return false;
      }
    }, [cart, saveCart]);
  
    const removeCartItem = useCallback(async (id, size, color) => {
      try {
        setError(null);
        if (!id || !size || !color) {
          throw new Error("Invalid removal parameters");
        }
  
        const copyCart = structuredClone(cart);
        
        if (!copyCart[id]) {
          throw new Error("Product not found in cart");
        }
  
        copyCart[id] = copyCart[id].filter(
          (item) => item.size !== size || item.color !== color
        );
  
        if (copyCart[id].length === 0) {
          delete copyCart[id];
        }
  
        setCart(copyCart);
        await saveCart(copyCart);
        return true;
      } catch (error) {
        console.error("Error removing item:", error);
        setError(error.message || "Failed to remove item");
        return false;
      }
    }, [cart, saveCart]);
  
    const clearCart = useCallback(async () => {
      try {
        setError(null);
        const emptyCart = {};
        setCart(emptyCart);
        await saveCart(emptyCart);
        return true;
      } catch (error) {
        console.error("Error clearing cart:", error);
        setError("Failed to clear cart");
        return false;
      }
    }, [saveCart]);
  
    const getCartCount = useCallback(() => {
      try {
        return Object.values(cart).reduce((total, items) => 
          total + items.reduce((itemTotal, item) => 
            itemTotal + (item.quantity || 0), 0
          ), 0
        );
      } catch (error) {
        console.error("Error calculating cart count:", error);
        return 0;
      }
    }, [cart]);
  
    const getCartAmount = useCallback(() => {
      try {
        return Object.values(cart).reduce((total, items) => 
          total + items.reduce((itemTotal, item) => 
            itemTotal + ((item.quantity || 0) * (item.product?.price || 0)), 0
          ), 0
        );
      } catch (error) {
        console.error("Error calculating cart amount:", error);
        return 0;
      }
    }, [cart]);
  
    const value = {
      cart,
      isLoading,
      error,
      addToCart,
      updateQuantity,
      removeCartItem,
      clearCart,
      getCartCount,
      getCartAmount,
      syncCart,
    };
  
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
  };
  
  export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
      throw new Error("useCart must be used within a CartProvider");
    }
    return context;
  };
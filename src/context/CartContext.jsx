import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./NewAuthContext";

const CartContext = createContext({
  cart: {},
  setCart: () => {},
  addToCart: () => {},
  isLoading: false,
  error: null,
  getCartCount: 0,
  updateQuantity: () => {},
  navigate: () => {},
  getCartAmount: () => 0,
  removeCartItem: () => {},
  clearCart: () => {},
});

// Helper function to get storage key for a user
const getStorageKey = (userId) => {
  return userId ? `cart_${userId}` : "anonymous_cart";
};

const loadCartFromStorage = (userId) => {
  const storageKey = getStorageKey(userId);
  try {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : {};
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return {};
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carts, setCarts] = useState({}); // Store all carts
  const [cart, setCart] = useState({}); // Current user's cart
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all carts from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedCarts = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("cart_")) {
          const cartData = localStorage.getItem(key);
          if (cartData) {
            loadedCarts[key] = JSON.parse(cartData);
          }
        }
      }
      setCarts(loadedCarts);
    } catch (error) {
      console.error("Error loading cart:", error);
      setError("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch cart when user changes
  useEffect(() => {
    const storageKey = getStorageKey(user?._id);
    const savedCart = carts[storageKey] || {};
    setCart(savedCart);
  }, [user, carts]);

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart) => {
    setError(null);
    const storageKey = getStorageKey(user?._id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCart));
      setCarts((prev) => ({
        ...prev,
        [storageKey]: newCart,
      }));
    } catch (error) {
      console.error("Error saving cart:", error);
      setError("Failed to save cart");
      throw error;
    }
  };

  const addToCart = (id, size, color, product) => {
    try {
      setError(null);
      let copyCart = structuredClone(cart);
      // console.log("Product", id, product);
      if (copyCart[id]) {
        // Check if item with same size AND color combination exists
        const existingItem = copyCart[id].find(
          (item) => item.size === size && item.color === color
        );

        if (existingItem) {
          // If same size and color combination exists, increment quantity
          existingItem.quantity += 1;
        } else {
          // If combination doesn't exist, add new item
          copyCart[id].push({
            size,
            quantity: 1,
            color,
            product,
          });
        }
      } else {
        // If product id doesn't exist in cart, create new array with item
        copyCart[id] = [
          {
            size,
            quantity: 1,
            color,
            product,
          },
        ];
      }

      setCart(copyCart);
      saveCart(copyCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError(error.message || "Failed to add item to cart");
      return false;
    }
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((total, items) => {
      return (
        total +
        items.reduce((itemTotal, item) => {
          return itemTotal + item.quantity;
        }, 0)
      );
    }, 0);
  };

  const updateQuantity = async (itemId, size, color, quantity) => {
    try {
      let copyCart = structuredClone(cart);
      if (!copyCart[itemId]) {
        throw new Error("Product not found in cart");
      }
      copyCart[itemId].map((item) => {
        if (item.size === size && item.color === color) {
          item.quantity = quantity;
        }
      });

      setCart(copyCart);
      saveCart(copyCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(error.message || "Failed to update quantity");
      return false;
    }
  };

  const removeCartItem = (id, size, color) => {
    try {
      let copyCart = structuredClone(cart);

      if (!copyCart[id]) {
        throw new Error("Product not found in cart");
      }

      copyCart[id] = copyCart[id].filter(
        (item) => item.size !== size || item.color !== color
      );
      setCart(copyCart);
      saveCart(copyCart);
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error.message || "Failed to remove item");
      return false;
    }
  };

  const getCartAmount = async () => {
    return Object.values(cart).reduce((total, items) => {
      return (
        total +
        items.reduce((subTotal, item) => {
          return (subTotal += item.quantity * item.product.price);
        }, 0)
      );
    }, 0);
  };

  const clearCart = () => {
    try {
      setError(null);
      setCart({});
      saveCart({});
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart");
      return false;
    }
  };
  // Function to merge anonymous cart with user cart on login
  const mergeAnonymousCart = () => {
    const anonymousKey = getStorageKey();
    const anonymousCart = loadCartFromStorage();

    if (Object.keys(anonymousCart).length > 0) {
      // Merge items from anonymous cart into user's cart
      Object.entries(anonymousCart).forEach(([productId, items]) => {
        items.forEach((item) => {
          addToCart(productId, item.size, item.color, item.product);
        });
      });

      // Clear anonymous cart
      localStorage.removeItem(anonymousKey);
    }
  };

  // Handle cart merging when user logs in
  useEffect(() => {
    if (user?._id) {
      mergeAnonymousCart();
    }
  }, [user?._id]);

  const value = {
    addToCart,
    getCartCount,
    updateQuantity,
    navigate,
    getCartAmount,
    removeCartItem,
    cart,
    clearCart,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(CartContext);
};

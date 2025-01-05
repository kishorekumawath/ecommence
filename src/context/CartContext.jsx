import { use } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CartContext = createContext({
  cart: {},
  setCart: () => {},
  addToCart: () => {},
  getCartCount: 0,
  updateQuantity: () => {},
  navigate: () => {},
  getCartAmount: () => {},
  removeCartItem: () => {},
});

export const useCartContext = () => {
  return useContext(CartContext);
};

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

  // Load all carts from localStorage on mount
  useEffect(() => {
    const loadedCarts = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("cart_")) {
        try {
          const cartData = localStorage.getItem(key);
          if (cartData) {
            loadedCarts[key] = JSON.parse(cartData);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
    setCarts(loadedCarts);
  }, []);

  console.log("cart", cart);

  // Switch cart when user changes
  useEffect(() => {
    const storageKey = getStorageKey(user?._id);
    const savedCart = carts[storageKey] || {};
    setCart(savedCart);
  }, [user, carts]);

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart) => {
    const storageKey = getStorageKey(user?._id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCart));
      setCarts((prev) => ({
        ...prev,
        [storageKey]: newCart,
      }));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = (id, size, color, product) => {
    let copyCart = structuredClone(cart);
    console.log("ccc", copyCart[id]);
    if (copyCart[id]) {
      //item already exists
      console.log("cart");
      //item already exists with size and color
      if (
        copyCart[id].map((item) => item.size).includes(size) &&
        copyCart[id].map((item) => item.color).includes(color)
      ) {
        copyCart[id].map((item) => {
          if (item.size === size && item.color === color) {
            item.quantity += 1;
          }
        });
      } else {
        copyCart[id].push({
          size: size,
          quantity: 1,
          color: color,
          product: product,
        });
      }
    } else {
      copyCart[id] = [];
      copyCart[id].push({
        size: size,
        quantity: 1,
        color: color,
        product: product,
      });
    }
    setCart(copyCart);
    saveCart(copyCart);
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
    let copyCart = structuredClone(cart);
    console.log("ccc", copyCart[itemId]);
    copyCart[itemId].map((item) => {
      if (item.size === size && item.color === color) {
        item.quantity = quantity;
      }
    });

    setCart(copyCart);
    saveCart(copyCart);
  };

  const removeCartItem = (id, size, color) => {
    let copyCart = structuredClone(cart);
    copyCart[id] = copyCart[id].filter(
      (item) => item.size !== size || item.color !== color
    );
    setCart(copyCart);
    saveCart(copyCart);
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
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

import { use } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

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
// Helper functions for localStorage
const saveCartToStorage = (cart, userId) => {
  const storageKey = getStorageKey(userId);
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
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
  const [cart, setCart] = useState(() => loadCartFromStorage());

  const navigate = useNavigate();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  console.log("cart", cart);

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
  };

  const removeCartItem = (id, size, color) => {
    let copyCart = structuredClone(cart);
    copyCart[id] = copyCart[id].filter(
      (item) => item.size !== size || item.color !== color
    );
    setCart(copyCart);
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

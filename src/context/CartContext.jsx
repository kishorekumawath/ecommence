import { s } from "framer-motion/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext({
  cartItems: {},
  setCartItems: () => {},
  addToCart: () => {},
  getCartCount: 0,
  updateQuantity: () => {},
  navigate: () => {},
  getCartAmount: () => {},
  cartItemsData: [],
  setCartItemsData: () => {},
});

export const useCartContext = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const [cartItemsData, setCartItemsData] = useState([]);
  // {itemId: 1, size: "S"}
  const navigate = useNavigate();

  const addToCart = (itemId, size) => {
    if (!size) {
      console.log("size is required");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      //item already exists
      if (cartData[itemId][size]) {
        //item already exists with size
        cartData[itemId][size] += 1;
      } else {
        // item does not exist with size
        cartData[itemId][size] = 1;
      }
    } else {
      // item does not exist
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let count = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            count += cartItems[items][item];
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    return count;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = async () => {
    let totalAmount = 0;
    for (const item in cartItemsData) {
      totalAmount +=
        cartItemsData[item].quantity * cartItemsData[item].product.price;
    }
    console.log("price", totalAmount);
    return totalAmount;
  };


  const value = {
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    navigate,
    getCartAmount,
    cartItemsData,
    setCartItemsData,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

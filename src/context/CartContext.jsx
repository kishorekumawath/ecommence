import { s } from "framer-motion/client";
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

// Helper function to get storage key for a user
const getStorageKey = (userId) => {
  return userId ? `cart_${userId}` : 'anonymous_cart';
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const [cartItemsData, setCartItemsData] = useState([]);

  const navigate = useNavigate();
  
   // Load all carts from localStorage on mount
   useEffect(() => {
    const loadedCarts= {};

    console.log("key", getStorageKey(null));
   const Data = localStorage.getItem(getStorageKey(null));

   console.log("Data local", Data);
 
}, []);


useEffect(() => {
  console.log("cartData", cartItems);
  const jsonData = JSON.stringify(cartItems);
  console.log("eee", jsonData);
  localStorage.setItem(getStorageKey(null), JSON.stringify(cartItems));
},[cartItems])
  

  const addToCart = (itemId, size,color) => {
    
    let cartData = structuredClone(cartItems);


    if (cartData[itemId]) {
      //item already exists
      if ((cartData[itemId].map((item) => item.size).includes(size) && cartData[itemId].map((item) => item.color).includes(color))) {
        //item already exists with size
        cartData[itemId].map((item) => {
          if (item.size === size && item.color === color) {
            item.quantity += 1;
          }
        });
      } else {
        // item does not exist with size
       cartData[itemId].push({
          size: size,
          quantity: 1,
          color: color
        });
        
        
      }
       
    } else {
      // item does not exist
      cartData[itemId] = [];
      cartData[itemId].push({
        size: size,
        quantity: 1,
        color: color
      });
   
    }

    
    setCartItems(cartData);
  };



  const getCartCount = () => {
   return Object.values(cartItems).reduce((total, items) => {
      return total + items.reduce((itemTotal, item) => {
        return itemTotal + item.quantity;
        }, 0);
      }, 0);
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



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import type { Product } from '../types';

// // Type definitions
// interface CartItem extends Product {
//     quantity: number;
// }

// interface CartState {
//     items: CartItem[];
//     total: number;
// }

// interface CartContextType {
//     items: CartItem[];
//     addToCart: (product: Product, quantity?: number) => void;
//     removeFromCart: (productId: string) => void;
//     updateQuantity: (productId: string, quantity: number) => void;
//     clearCart: () => void;
//     total: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const calculateTotal = (items: CartItem[]): number => {
//     return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
// };

// // Helper function to get storage key for a user
// const getStorageKeye = (userId: string | undefined) => {
//     return userId ? `cart_${userId}` : 'anonymous_cart';
// };

// export function CartProvider({ children }: { children: React.ReactNode }) {
//     const { user } = useAuth();
//     // console.log('User ID:', user?.email);

//     const [carts, setCarts] = useState<Record<string, CartState>>({});
//     const [currentCart, setCurrentCart] = useState<CartState>({ items: [], total: 0 });

//     // Load all carts from localStorage on mount
//     useEffect(() => {
//         const loadedCarts: Record<string, CartState> = {};
//         // Get all keys from localStorage
//         for (let i = 0; i < localStorage.length; i++) {
//             const key = localStorage.key(i);
//             if (key && key.startsWith('cart_')) {
//                 try {
//                     const cartData = localStorage.getItem(key);
//                     if (cartData) {
//                         loadedCarts[key] = JSON.parse(cartData);
//                     }
//                 } catch (error) {
//                     console.error('Error loading cart:', error);
//                 }
//             }
//         }
//         setCarts(loadedCarts);
//     }, []);

//     // Switch cart when user changes
//     useEffect(() => {
//         const storageKey = getStorageKey(user?.email);
//         const savedCart = carts[storageKey] || { items: [], total: 0 };
//         setCurrentCart(savedCart);
//     }, [user, carts]);

//     // Save cart to localStorage whenever it changes
//     const saveCart = (cartState: CartState) => {
//         const storageKey = getStorageKey(user?.email);
//         try {
//             localStorage.setItem(storageKey, JSON.stringify(cartState));
//             setCarts(prev => ({
//                 ...prev,
//                 [storageKey]: cartState
//             }));
//         } catch (error) {
//             console.error('Error saving cart:', error);
//         }
//     };

//     const addToCart = (product: Product, quantity: number = 1) => {
//         setCurrentCart(prevCart => {
//             const existingItem = prevCart.items.find(item => item.id === product.id);
//             let newItems;

//             if (existingItem) {
//                 newItems = prevCart.items.map(item =>
//                     item.id === product.id
//                         ? { ...item, quantity: item.quantity + quantity }
//                         : item
//                 );
//             } else {
//                 newItems = [...prevCart.items, { ...product, quantity }];
//             }

//             const newCart = {
//                 items: newItems,
//                 total: calculateTotal(newItems)
//             };

//             saveCart(newCart);
//             return newCart;
//         });
//     };

//     const removeFromCart = (productId: string) => {
//         setCurrentCart(prevCart => {
//             const newItems = prevCart.items.filter(item => item.id !== productId);
//             const newCart = {
//                 items: newItems,
//                 total: calculateTotal(newItems)
//             };

//             saveCart(newCart);
//             return newCart;
//         });
//     };

//     const updateQuantity = (productId: string, quantity: number) => {
//         if (quantity < 0) return;

//         setCurrentCart(prevCart => {
//             const newItems = quantity === 0
//                 ? prevCart.items.filter(item => item.id !== productId)
//                 : prevCart.items.map(item =>
//                     item.id === productId
//                         ? { ...item, quantity }
//                         : item
//                 );

//             const newCart = {
//                 items: newItems,
//                 total: calculateTotal(newItems)
//             };

//             saveCart(newCart);
//             return newCart;
//         });
//     };

//     const clearCart = () => {
//         const newCart = { items: [], total: 0 };
//         setCurrentCart(newCart);
//         saveCart(newCart);
//     };

//     return (
//         <CartContext.Provider
//             value={{
//                 items: currentCart.items,
//                 total: currentCart.total,
//                 addToCart,
//                 removeFromCart,
//                 updateQuantity,
//                 clearCart,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// }

// export const useCart = () => {
//     const context = useContext(CartContext);
//     if (context === undefined) {
//         throw new Error('useCart must be used within a CartProvider');
//     }
//     return context;
// };
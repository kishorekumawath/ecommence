import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext({
  cart: {},
  cartItems: {},
  setCartItems: () => { },
  addToCart: () => { },
  getCartCount: 0,
  updateQuantity: () => { },
  navigate: () => { },
  getCartAmount: () => { },
  cartItemsData: [],
  setCartItemsData: () => { },
  removeCartItem: () => { },
});

export const useCartContext = () => {
  return useContext(CartContext);
};

// Helper function to get storage key for a user
const getStorageKey = (userId) => {
  return userId ? `cart_${userId}` : 'anonymous_cart';
};

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState({});

  const [cartItems, setCartItems] = useState([]);

  const [cartItemsData, setCartItemsData] = useState([]);

  const navigate = useNavigate();

  // Load all carts from localStorage on mount
  // useEffect(() => {
  //   const loadedCarts = {};

  //   console.log("key", getStorageKey(null));
  //   const Data = localStorage.getItem(getStorageKey(null));

  //   console.log("Data local", Data);

  // }, []);

  //   {
  //     "676ed08e3bf6d02449d766c7": [
  //         {
  //             "id": "1",  
  //             "size": "M",
  //             "quantity": 1,
  //             "color": "Wh",
  //             "product": {
  //                 "_id": "676ed08e3bf6d02449d766c7",
  //                 "name": "Unisex  Oversized T-Shirt White",
  //                 "sku": "UAopUOs-Wh-S-UntitledProjectArtboard1-Fr-aop",
  //                 "details": [
  //                     "100% COTTON",
  //                     "WEIGHT - 250 GSM",
  //                     "HIGH-DENSITY PRINT"
  //                 ],
  //                 "description": "Material composition: Single Jersey 100% cotton.Fit type: Regular Fit .Sleeve typeHalf Sleeve.Collar style: Collarless. Length: Standard Length. Neck style: Round Neck. Country of Origin: India",
  //                 "category": {
  //                     "_id": "675ac0d9de6a7b69413b8118",
  //                     "name": "Oversized Classic T-Shirt",
  //                     "description": "",
  //                     "parentCategory": {
  //                         "_id": "675ac0d8de6a7b69413b80ee",
  //                         "name": "Men's Clothing"
  //                     },
  //                     "level": 2
  //                 },
  //                 "price": 600,
  //                 "size": [
  //                     "S",
  //                     "M",
  //                     "L",
  //                     "XL",
  //                     "XXl"
  //                 ],
  //                 "stock": 8,
  //                 "image": "https://dashboard.qikink.com/assets//client_products/22122578/1735289567.png",
  //                 "addImages": [],
  //                 "reviews": [
  //                     {
  //                         "_id": "6772c06ebcec8a5e5d498db1",
  //                         "user": "675bcd77bbb356a32b34fe94",
  //                         "rating": 4.8,
  //                         "comment": "Very Nive Product",
  //                         "createdAt": "2024-12-30T15:46:54.344Z"
  //                     }
  //                 ],
  //                 "createdAt": "2024-12-27T16:06:38.381Z",
  //                 "updatedAt": "2024-12-31T11:48:42.510Z",
  //                 "__v": 0,
  //                 "color": [
  //                     "Bk",
  //                     "Wh"
  //                 ],
  //                 "addInfo": "Just Additional Information"
  //             }
  //         }
  //     ]
  // }
  // useEffect(() => {
  //   console.log("cartData", cartItems);
  //   const jsonData = JSON.stringify(cartItems);
  //   console.log("eee", jsonData);
  //   localStorage.setItem(getStorageKey(null), JSON.stringify(cartItems));
  // }, [cartItems])

  console.log("cart", cart);


  const addToCart = (id, size, color, product) => {

    let copyCart = structuredClone(cart);
    console.log('ccc', copyCart[id]);
    if (copyCart[id]) {

      //item already exists
      console.log("cart",);
      //item already exists with size and color
      if ((copyCart[id].map((item) => item.size).includes(size)) && (copyCart[id].map((item) => item.color).includes(color))) {
        copyCart[id].map((item) => {
          if (item.size === size && item.color === color) {
            item.quantity += 1;
          }
        })
      }else{
        copyCart[id].push({
          
          size: size,
          quantity: 1,
          color: color,
          product: product
        });
      }
    } else {
      copyCart[id] = [];
      copyCart[id].push({
    
        size: size,
        quantity: 1,
        color: color,
        product: product
      });

    }
    setCart(copyCart);

  };



  const getCartCount = () => {
    return Object.values(cart).reduce((total, items) => {
      return total + items.reduce((itemTotal, item) => {
        return itemTotal + item.quantity;
      }, 0);
    }, 0);
  };


  const updateQuantity = async (itemId,size,color, quantity) => {
    
    let copyCart = structuredClone(cart);
    console.log('ccc', copyCart[itemId]);
    copyCart[itemId].map((item) => {
      if (item.size === size && item.color === color) {
        item.quantity = quantity;
      }
    })

    setCart(copyCart);
  };

  const removeCartItem = (id,size,color) => {
    let copyCart = structuredClone(cart);
    copyCart[id] = copyCart[id].filter((item) => item.size !== size || item.color !== color);
    setCart(copyCart);
  };

  const getCartAmount = async () => {
   
    return Object.values(cart).reduce((total,items) => {
      return total + items.reduce((subTotal,item) => {
        return subTotal += item.quantity * item.product.price;
      },0);
    },0);
    
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
    removeCartItem,
    cart
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
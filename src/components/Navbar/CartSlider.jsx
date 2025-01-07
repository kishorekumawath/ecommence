import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Title } from "../../components/Title";
import { useCartContext } from "../../context/CartContext";
import { colorMap } from "../../context/CollectionsContext";
import CartTotal from "../CartTotal";

function CartSlider({ cartVisible, setCartVisible }) {
  const { cart, updateQuantity, navigate, removeCartItem, getCartAmount } =
    useCartContext();
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    getCartAmount().then((total) => setTotal(total));
  }, [getCartAmount]);

  const handleCheckout = () => {
    // Convert cart object to array of items
    const cartItems = Object.keys(cart).flatMap((key) => cart[key]);

    // Calculate totals
    const itemsTotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Format items for summary
    const formattedItems = cartItems.map((item) => ({
      id: item.product._id,
      name: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
      image: item.product.image,
      subtotal: item.product.price * item.quantity,
    }));

    const cartSummary = {
      items: formattedItems,
      summary: {
        totalAmount: itemsTotal,
        itemCount: cartItems.length,
        shippingFee: shippingFee, // Using the shippingFee from state
        // tax: itemsTotal * 0.18, // 18% GST
        finalTotal: itemsTotal + shippingFee, // Final total including tax and shipping (temsTotal * 0.18)
      },
      orderDetails: {
        createdAt: new Date().toISOString(),
        currency: "INR",
        status: "pending",
      },
    };

    // Navigate to place order with cart summary
    navigate("/place-order", {
      state: { cartSummary },
      replace: false, // If user navigates back, they can see their cart
    });
    setCartVisible(false);
  };
  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-50 bg-white flex flex-col transition-all duration-500 ${
        cartVisible ? "lg:w-[40%] w-[90%]" : "w-0 opacity-0"
      }`}
    >
      {/* Top Section: Title and Close Button */}
      <div className="px-5 text-2xl">
        <div
          onClick={() => setCartVisible(false)}
          className="w-10 h-10 mb-5 bg-orange-300 cursor-pointer gap-4 flex items-center justify-center group rounded-r-full"
        >
          <img
            src={assets.cancel}
            alt="Close"
            className="h-3 group-hover:rotate-90 duration-300"
          />
        </div>
        <Title text1="My" text2="Cart" />
      </div>

      {/* Scrollable Cart Items */}
      <div className="flex-1 overflow-y-auto p-5 border border-gray-300 mx-5 rounded-md">
        {Object.keys(cart).length > 0 ? (
          Object.keys(cart).map((key) =>
            cart[key].map((item) => (
              <div
                key={`${Math.random()}`}
                className="py-4 border-b text-gray-700 gap-4 flex flex-col items-center justify-between"
              >
                <div className="flex items-start gap-4 text-sm  md:text-base w-full">
                  {/* Product Image */}
                  <img
                    onClick={() => navigate(`/product/${item.product._id}`)}
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer"
                  />

                  {/* Product Details */}
                  <div className="flex flex-col flex-grow gap-1 px-4">
                    <p className="text-md font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Price: ₹{item.product.price}
                    </p>
                    <div className="flex">
                      <p className="text-sm text-gray-500">Color: </p>
                      <div
                        className={`w-5 ml-2 h-5 rounded-full border border-gray-300 ${
                          colorMap[item.color]
                        }`}
                      ></div>
                      <p className="text-sm pl-2 text-gray-500">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex justify-between w-full items-center">
                  <div className="flex text-sm items-center gap-2 bg-gray-50 py-3 px-2 rounded-full">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          return updateQuantity(
                            item.product._id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          );
                        }
                      }}
                      className="w-8 h-8 border border-gray-300 text-gray-400 flex items-center justify-center rounded-lg hover:text-black hover:border-black"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border border-gray-300 text-gray-400 flex items-center justify-center rounded-lg hover:text-black hover:border-black"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Button */}
                  <img
                    onClick={() =>
                      removeCartItem(item.product._id, item.size, item.color)
                    }
                    className="w-5 h-5 cursor-pointe"
                    src={assets.bin_icon}
                    alt="Delete"
                  />
                </div>
              </div>
            ))
          )
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Bottom Section: Cart Total and Checkout */}
      <div className="p-5">
        <CartTotal total={total} shippingFee={shippingFee} />
        <div className="w-full text-end mt-5">
          <button
            onClick={handleCheckout}
            className="bg-black text-white px-10 py-3 text-sm"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartSlider;

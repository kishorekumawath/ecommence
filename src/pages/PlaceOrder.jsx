// import React, { useState, useEffect } from "react";
// import { Title } from "../components/Title";
// import CartTotal from "../components/CartTotal";
// import { assets } from "../assets/assets";
// import { useCartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";
// import { colorMap } from "../context/CollectionsContext";
// import { useLocation, useNavigate } from "react-router-dom";

// function PlaceOrder() {
//   const { getCartCount, updateQuantity, removeCartItem, cart, getCartAmount } =
//     useCartContext();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { clearCart } = useCartContext();
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     doorNo: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "",
//   });
//   const [total, setTotal] = useState(0);
//   const [shippingFee, setShippingFee] = useState(0);

//   useEffect(() => {
//     getCartAmount().then((total) => setTotal(total));
//   }, [getCartAmount]);

//   useEffect(() => {
//     if (user?.address) {
//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         doorNo: user.address.doorNo || "",
//         address: user.address.street || "",
//         city: user.address.city || "",
//         state: user.address.state || "",
//         pincode: user.address.pincode || "",
//         country: user.address.country || "",
//       });
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const calculateTotalAmount = () => {
//     return Object.values(cart)
//       .flat()
//       .reduce((total, item) => {
//         return total + item.product.price * item.quantity;
//       }, 0);
//   };

//   const createOrderPayload = () => {
//     const orderItems = Object.values(cart)
//       .flat()
//       .map((item) => ({
//         productId: item.product._id,
//         size: item.size,
//         quantity: item.quantity.toString(),
//         color: item.color,
//       }));

//     return {
//       orderItems,
//       deliveryAddress: {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         doorNo: formData.doorNo,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       },
//       customerId: user?._id,
//       customerName: `${formData.firstName} ${formData.lastName}`,
//       totalAmount: calculateTotalAmount(),
//       gateway: paymentMethod,
//       gift_wrap: 0,
//       rush_order: 0,
//       orderType: "CART_CHECKOUT",
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const orderPayload = createOrderPayload();
//     console.log("Payload", orderPayload);

//     try {
//       // Replace with your API endpoint
//       const response = await fetch(
//         `http://localhost:9000/api/v1/qikink/order`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderPayload),
//         }
//       );
//       const qikinkResponseData = await response.json();
//       const qiKinkOrderId = qikinkResponseData.qikinkOrderId;
//       console.log("Qikink Response:", qiKinkOrderId);

//       if (response.ok) {
//         clearCart();
//         navigate(`/successPage/${qiKinkOrderId}`, {
//           state: { orderDetails: qikinkResponseData },
//         });
//       }
//     } catch (error) {
//       console.error("Order creation failed:", error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col md:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] p-10"
//     >
//       <div className="flex flex-col gap-4 w-full lg:w-[50%]">
//         <div className="text-xl sm:text-2xl my-3">
//           <Title text1={"ORDER"} text2={"  INFORMATION"} />
//         </div>

//         <div className="p-5 border border-gray-300 rounded-lg flex gap-3 flex-col">
//           <Title text1={"CONTACT"} text2={"  INFORMATION"} />
//           <div className="flex gap-3">
//             <input
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="First Name"
//               required
//             />
//             <input
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="Last Name"
//               required
//             />
//           </div>

//           <div className="flex gap-3">
//             <input
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="email"
//               placeholder="Email Address"
//               required
//             />
//             <input
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="tel"
//               placeholder="Phone Number"
//               required
//             />
//           </div>
//         </div>

//         <div className="p-5 border border-gray-300 rounded-lg flex gap-3 flex-col">
//           <Title text1={"DELIVERY"} text2={"  INFORMATION"} />
//           <input
//             name="doorNo"
//             value={formData.doorNo}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//             type="text"
//             placeholder="Door No"
//             required
//           />
//           <input
//             name="address"
//             value={formData.address}
//             onChange={handleInputChange}
//             className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//             type="text"
//             placeholder="Street Address"
//             required
//           />

//           <div className="flex gap-3">
//             <input
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="City"
//               required
//             />
//             <input
//               name="state"
//               value={formData.state}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="State"
//               required
//             />
//           </div>

//           <div className="flex gap-3">
//             <input
//               name="pincode"
//               value={formData.pincode}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="Zip Code"
//               required
//             />
//             <input
//               name="country"
//               value={formData.country}
//               onChange={handleInputChange}
//               className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
//               type="text"
//               placeholder="Country"
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Right side remains mostly the same, just update the button */}
//       <div className="mt-8 w-full lg:w-[40%]">
//         {/* ... existing cart display code ... */}

//         <div className="flex">
//           <Title text1={"CART "} text2={"  ITEMS"} />
//           <p className="pl-2">{getCartCount()}</p>
//         </div>
//         {/* Scrollable Cart Items */}
//         <div className="flex-1 overflow-y-auto p-2 border border-gray-300  rounded-md w-full">
//           {Object.keys(cart).length > 0 ? (
//             Object.keys(cart).map((key) =>
//               cart[key].map((item) => (
//                 <div
//                   key={`${Math.random()}`}
//                   className="py-4 border-b text-gray-700 flex flex-col gap-4 md:gap-6 "
//                 >
//                   {/* Product Details Section */}
//                   <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-sm md:text-base w-full">
//                     {/* Product Image */}
//                     <img
//                       onClick={() => navigate(`/product/${item.product._id}`)}
//                       src={item.product.image}
//                       alt={item.product.name}
//                       className="w-20 h-20 object-cover rounded-md cursor-pointer"
//                     />

//                     {/* Product Details */}
//                     <div className="flex flex-col flex-grow gap-2">
//                       <p className="text-md font-semibold">
//                         {item.product.name}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Price: ₹{item.product.price}
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm text-gray-500">Color:</p>
//                         <div
//                           className={`w-5 h-5 rounded-full border border-gray-300 ${
//                             colorMap[item.color]
//                           }`}
//                         ></div>
//                         <p className="text-sm text-gray-500 pl-2">
//                           Size: {item.size}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Quantity Controls & Delete Button */}
//                   <div className="flex justify-between items-center gap-4">
//                     {/* Quantity Controls */}
//                     <div className="flex items-center gap-2 bg-gray-50 py-3 px-2 rounded-full">
//                       <button
//                         onClick={() => {
//                           if (item.quantity > 1) {
//                             return updateQuantity(
//                               item.product._id,
//                               item.size,
//                               item.color,
//                               item.quantity - 1
//                             );
//                           }
//                         }}
//                         className="w-8 h-8 border border-gray-300 text-gray-400 flex items-center justify-center rounded-lg hover:text-black hover:border-black"
//                       >
//                         -
//                       </button>
//                       <span className="text-lg font-medium px-2">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           updateQuantity(
//                             item.product._id,
//                             item.size,
//                             item.color,
//                             item.quantity + 1
//                           )
//                         }
//                         className="w-8 h-8 border border-gray-300 text-gray-400 flex items-center justify-center rounded-lg hover:text-black hover:border-black"
//                       >
//                         +
//                       </button>
//                     </div>

//                     {/* Delete Button */}
//                     <img
//                       onClick={() =>
//                         removeCartItem(item.product._id, item.size, item.color)
//                       }
//                       className="w-5 h-5 cursor-pointer"
//                       src={assets.bin_icon}
//                       alt="Delete"
//                     />
//                   </div>
//                 </div>
//               ))
//             )
//           ) : (
//             <p className="text-center text-gray-500">Your cart is empty.</p>
//           )}
//         </div>

//         <div className="mt-8 min-w-60">
//           <CartTotal total={total} shippingFee={shippingFee} />
//         </div>

//         <div className="mt-12">
//           <Title text1={"PAYMENT"} text2={"METHOD"} />
//           <div className="flex gap-3 flex-col lg:flex-row">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div
//                 onClick={() => setPaymentMethod("Prepaid")}
//                 className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
//               >
//                 <p
//                   className={`min-w-3.5 h-3.5 border rounded-full ${
//                     paymentMethod === "Prepaid" ? "bg-orange-300" : ""
//                   }`}
//                 ></p>
//                 <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
//               </div>

//               <div
//                 onClick={() => setPaymentMethod("COD")}
//                 className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
//               >
//                 <p
//                   className={`min-w-3.5 h-3.5 border rounded-full ${
//                     paymentMethod === "COD" ? "bg-orange-300" : ""
//                   }`}
//                 ></p>
//                 <p className="text-gray-500 text-sm font-medium mx-4">
//                   CASH ON DELIVERY
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-center md:justify-start w-full text-end mt-8">
//             <button
//               type="submit"
//               className="bg-orange-300 text-black px-16 py-3 text-sm rounded-md"
//             >
//               PLACE ORDER
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default PlaceOrder;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { colorMap } from "../context/CollectionsContext";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCartContext();
  const cartSummary = location.state?.cartSummary;
  const isBuyNow = location.state?.isBuyNow;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    doorNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    const loadRazorpay = async () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsRazorpayLoaded(true);
      script.onerror = () => {
        setError("Failed to load payment gateway. Please try again later.");
      };
      document.body.appendChild(script);
    };

    loadRazorpay();

    return () => {
      const script = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!cartSummary) {
      navigate("/cart");
      return;
    }

    if (user?.address) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        doorNo: user.address.doorNo || "",
        address: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        pincode: user.address.pincode || "",
        country: user.address.country || "",
      });
    }
  }, [user, cartSummary]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createOrderPayload = () => {
    const orderItems = cartSummary.items.map((item) => ({
      productId: item.id,
      size: item.size,
      quantity: item.quantity.toString(),
      color: item.color,
    }));

    return {
      orderItems,
      deliveryAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        doorNo: formData.doorNo,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      customerId: user?._id,
      customerName: `${formData.firstName} ${formData.lastName}`,
      totalAmount: cartSummary.summary.finalTotal,
      gateway: paymentMethod,
      gift_wrap: 0,
      rush_order: 0,
      orderType: isBuyNow ? "BUY_NOW" : "CART_CHECKOUT",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //razorpay integration

    const orderPayload = createOrderPayload();

    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/qikink/order",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (!isBuyNow) {
          clearCart();
        }
        navigate(`/successPage/${data.qikinkOrderId}`, {
          state: { orderDetails: data },
        });
      }
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row justify-between gap-4 p-10"
    >
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="First Name"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="Last Name"
                required
              />
            </div>
            <div className="flex gap-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                type="email"
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                type="tel"
                placeholder="Phone"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="flex flex-col gap-4">
            <input
              name="doorNo"
              value={formData.doorNo}
              onChange={handleInputChange}
              className="border rounded py-2 px-4 w-full"
              placeholder="Door No"
              required
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border rounded py-2 px-4 w-full"
              placeholder="Street Address"
              required
            />
            <div className="flex gap-4">
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="City"
                required
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="State"
                required
              />
            </div>
            <div className="flex gap-4">
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="PIN Code"
                required
              />
              <input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="border rounded py-2 px-4 w-full"
                placeholder="Country"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="max-h-60 overflow-y-auto">
              {cartSummary?.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm">₹{item.price}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Color:</p>
                      <div
                        className={`w-5 h-5 rounded-full border border-gray-300 ${
                          colorMap[item.color]
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSummary?.summary.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{cartSummary?.summary.shippingFee}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{cartSummary?.summary.tax}</span>
              </div> */}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{cartSummary?.summary.finalTotal}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-4">Payment Method</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Prepaid")}
                  className={`border p-4 rounded flex-1 ${
                    paymentMethod === "Prepaid" ? "border-orange-300" : ""
                  }`}
                >
                  Prepaid
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`border p-4 rounded flex-1 ${
                    paymentMethod === "COD" ? "border-orange-300" : ""
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-300 text-black py-3 rounded-md mt-6 font-medium"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

// checkout page with razorpay

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useCartContext } from "../context/CartContext";
// import { colorMap } from "../context/CollectionsContext";

// const PlaceOrder = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { clearCart } = useCartContext();
//   const cartSummary = location.state?.cartSummary;
//   const isBuyNow = location.state?.isBuyNow;

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     doorNo: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "",
//   });

//   useEffect(() => {
//     const loadRazorpay = async () => {
//       if (window.Razorpay) {
//         setIsRazorpayLoaded(true);
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => setIsRazorpayLoaded(true);
//       script.onerror = () => {
//         setError("Failed to load payment gateway. Please try again later.");
//       };
//       document.body.appendChild(script);
//     };

//     loadRazorpay();

//     return () => {
//       const script = document.querySelector(
//         'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
//       );
//       if (script) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!cartSummary) {
//       navigate("/cart");
//       return;
//     }

//     if (user?.address) {
//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         doorNo: user.address.doorNo || "",
//         address: user.address.street || "",
//         city: user.address.city || "",
//         state: user.address.state || "",
//         pincode: user.address.pincode || "",
//         country: user.address.country || "",
//       });
//     }
//   }, [user, cartSummary]);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const createOrderPayload = () => {
//     const orderItems = cartSummary.items.map((item) => ({
//       productId: item.id,
//       size: item.size,
//       quantity: item.quantity.toString(),
//       color: item.color,
//     }));

//     return {
//       orderItems,
//       deliveryAddress: {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         doorNo: formData.doorNo,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//       },
//       customerId: user?._id,
//       customerName: `${formData.firstName} ${formData.lastName}`,
//       totalAmount: cartSummary.summary.finalTotal,
//       gateway: paymentMethod,
//       gift_wrap: 0,
//       rush_order: 0,
//       orderType: isBuyNow ? "BUY_NOW" : "CART_CHECKOUT",
//     };
//   };

//   const handleRazorpayPayment = async (orderData) => {
//     console.log("Inside Razorpay");
//     const options = {
//       key: "rzp_test_Slq72fvAZ1MoLJ",
//       amount: (cartSummary.summary.finalTotal * 100).toString(),
//       currency: "INR",
//       name: "Moons Flare",
//       description: "Order Payment",
//       order_id: orderData.razorpayOrderId,
//       handler: async (response) => {
//         try {
//           console.log("Inside handler Razorpay response:", response);
//           const paymentCompleteResponse = await fetch(
//             "http://localhost:9000/api/v1/qikink/payment-complete",
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 orderId: orderData.qikinkOrderId,
//                 paymentId: response.razorpay_payment_id,
//                 razorpayOrderId: orderData.razorpayOrderId,
//               }),
//             }
//           );
//           console.log("Payment Complete Response:", paymentCompleteResponse);
//           if (!paymentCompleteResponse.ok) {
//             throw new Error("Failed to verify payment");
//           }

//           const paymentData = await paymentCompleteResponse.json();
//           if (!isBuyNow) {
//             clearCart();
//           }
//           navigate(`/successPage/${orderData.qikinkOrderId}`, {
//             state: { orderDetails: paymentData },
//           });
//         } catch (error) {
//           setError("Payment verification failed. Please contact support.");
//           setIsLoading(false);
//         }
//       },
//       prefill: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//         contact: formData.phone,
//       },
//       theme: {
//         color: "#f97316",
//       },
//     };

//     const razorpayInstance = new window.Razorpay(options);
//     razorpayInstance.open();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       const orderPayload = createOrderPayload();
//       const response = await fetch(
//         "http://localhost:9000/api/v1/qikink/order",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(orderPayload),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to create order");
//       }

//       if (paymentMethod === "Prepaid") {
//         if (!isRazorpayLoaded) {
//           throw new Error("Payment system is not ready. Please try again.");
//         }
//         await handleRazorpayPayment(data);
//       } else {
//         // COD flow
//         if (!isBuyNow) {
//           clearCart();
//         }
//         navigate(`/successPage/${data.qikinkOrderId}`, {
//           state: { orderDetails: data },
//         });
//       }
//     } catch (error) {
//       setError(error.message || "An error occurred. Please try again.");
//     } finally {
//       if (paymentMethod === "COD") {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col md:flex-row justify-between gap-4 p-10"
//     >
//       <div className="flex flex-col gap-4 w-full lg:w-1/2">
//         <h1 className="text-2xl font-bold mb-6">Checkout</h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <strong className="font-bold">Error!</strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md p-6 mb-4">
//           <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
//           {/* Contact form fields */}
//           <div className="flex flex-col gap-4">
//             <div className="flex gap-4">
//               <input
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="First Name"
//                 required
//               />
//               <input
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="Last Name"
//                 required
//               />
//             </div>
//             <div className="flex gap-4">
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 type="email"
//                 placeholder="Email"
//                 required
//               />
//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 type="tel"
//                 placeholder="Phone"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
//           {/* Address form fields */}
//           <div className="flex flex-col gap-4">
//             <input
//               name="doorNo"
//               value={formData.doorNo}
//               onChange={handleInputChange}
//               className="border rounded py-2 px-4 w-full"
//               placeholder="Door No"
//               required
//             />
//             <input
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               className="border rounded py-2 px-4 w-full"
//               placeholder="Street Address"
//               required
//             />
//             <div className="flex gap-4">
//               <input
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="City"
//                 required
//               />
//               <input
//                 name="state"
//                 value={formData.state}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="State"
//                 required
//               />
//             </div>
//             <div className="flex gap-4">
//               <input
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="PIN Code"
//                 required
//               />
//               <input
//                 name="country"
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 className="border rounded py-2 px-4 w-full"
//                 placeholder="Country"
//                 required
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-full lg:w-2/5">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//           <div className="flex flex-col gap-4">
//             <div className="max-h-60 overflow-y-auto">
//               {cartSummary?.items.map((item, index) => (
//                 <div key={index} className="flex gap-4 py-4 border-b">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                   <div className="flex flex-col">
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-500">Size: {item.size}</p>
//                     <p className="text-sm text-gray-500">
//                       Qty: {item.quantity}
//                     </p>
//                     <p className="text-sm">₹{item.price}</p>
//                     <div className="flex items-center gap-2">
//                       <p className="text-sm text-gray-500">Color:</p>
//                       <div
//                         className={`w-5 h-5 rounded-full border border-gray-300 ${
//                           colorMap[item.color]
//                         }`}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col gap-2 mt-4">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{cartSummary?.summary.totalAmount}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>₹{cartSummary?.summary.shippingFee}</span>
//               </div>
//               <div className="flex justify-between font-bold mt-2 pt-2 border-t">
//                 <span>Total</span>
//                 <span>₹{cartSummary?.summary.finalTotal}</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <p className="font-medium mb-4">Payment Method</p>
//               <div className="flex gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setPaymentMethod("Prepaid")}
//                   className={`border p-4 rounded flex-1 ${
//                     paymentMethod === "Prepaid" ? "border-orange-300" : ""
//                   }`}
//                 >
//                   Prepaid
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setPaymentMethod("COD")}
//                   className={`border p-4 rounded flex-1 ${
//                     paymentMethod === "COD" ? "border-orange-300" : ""
//                   }`}
//                 >
//                   Cash on Delivery
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center items-center gap-2 bg-orange-300 text-black py-3 rounded-md mt-6 font-medium disabled:bg-orange-200"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 "Place Order"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;

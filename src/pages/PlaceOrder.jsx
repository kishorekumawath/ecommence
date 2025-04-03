import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/NewAuthContext";
import { useCartContext } from "../context/CartContext";
import { colorMap } from "../context/CollectionsContext";

import { Loader2 } from "lucide-react";
import { Title } from "../components/Title";
import { assets } from "../assets/assets";
import { BASE_URL } from "../server/server";
import ProfileInputTile from "../components/ProfileInputTile";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart ,extraCharge} = useCartContext();
  const cartSummary = location.state?.cartSummary;
  const isBuyNow = location.state?.isBuyNow;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [shippingfee, setShippingFee] = useState(50);

  const total = cartSummary?.summary.totalAmount;
  const totalNoOfItems = cartSummary?.summary.noOfItems;
  const totalDiscount = extraCharge * totalNoOfItems;
  const originalPrice = total + totalDiscount;
  const discountPercentage =
  originalPrice > 0 ? Math.round((totalDiscount / originalPrice) * 100) : 0;

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

  // useEffect(() => {
  //   const loadRazorpay = async () => {
  //     if (window.Razorpay) {
  //       setIsRazorpayLoaded(true);
  //       return;
  //     }

  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.async = true;
  //     script.onload = () => setIsRazorpayLoaded(true);
  //     script.onerror = () => {
  //       setError("Failed to load payment gateway. Please try again later.");
  //     };
  //     document.body.appendChild(script);
  //   };

  //   loadRazorpay();

  //   return () => {
  //     const script = document.querySelector(
  //       'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
  //     );
  //     if (script) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // }, []);
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    if (!cartSummary) {
      navigate("/");
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
      totalAmount: cartSummary.summary.finalTotal + shippingfee,
      gateway: paymentMethod,
      gift_wrap: 0,
      rush_order: 0,
      orderType: isBuyNow ? "BUY_NOW" : "CART_CHECKOUT",
    };
  };

  const handleCODPayment = async (orderPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/qikink/order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      if (!isBuyNow) {
        clearCart();
      }
      navigate(`/successPage/${data.qikinkOrderId}`, {
        state: { orderDetails: data },
      });
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      if (paymentMethod === "COD") {
        setIsLoading(false);
      }
    }
  };
  const createRazorpayOrder = async (orderPayload) => {
    try {
      //load razorpay script
      const razorpayScriptLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!razorpayScriptLoaded) {
        throw new Error("Failed to load Razorpay script");
        return;
      }
      //step 1 initiate payment
      const initResponse = await fetch(
        `${BASE_URL}/api/v1/razorpay/initiate-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: orderPayload.totalAmount }),
        }
      );
      const { razorpayOrderId } = await initResponse.json();
      // console.log("Razorpay Order ID:", razorpayOrderId);
      //step 2 open razorpay payment window
      const options = {
        key: "rzp_test_Slq72fvAZ1MoLJ",
        amount: (orderPayload.totalAmount * 100).toString(),
        currency: "INR",
        name: "Moons Flare",
        description: "Order Payment",
        // image: "https://i.ibb.co/k6780Jr/logo.png",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // console.log("Inside handler Razorpay response:", response);
            const paymentCompleteResponse = await fetch(
              `${BASE_URL}/api/v1/razorpay/process-order`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...orderPayload,
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: razorpayOrderId,
                  // signature: response.razorpay_signature,
                }),
              }
            );
            if (!paymentCompleteResponse.ok) {
              throw new Error("Failed to verify payment");
            }
            const data = await paymentCompleteResponse.json();
            // console.log("Payment Complete Response:", data);
            if (!isBuyNow) {
              clearCart();
            }
            // console.log("Payment Complete Response: Next Navigate", data);
            navigate(`/successPage/${data.qikinkOrderId}`, {
              state: { orderDetails: data },
            });
          } catch (error) {
            setError("Payment verification failed. Please contact support.");
            setIsLoading(false);
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.doorNo}, ${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const orderPayload = createOrderPayload();
    try {
      if (paymentMethod === "COD") {
        handleCODPayment(orderPayload);
        return;
      }
      if (paymentMethod === "Prepaid") {
        createRazorpayOrder(orderPayload);
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row justify-between gap-4 p-5 md:p-10"
    >
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        <div className="text-2xl">
          <Title text1={"Checkout"} text2={"  Details"} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <Title text1="Contact" text2={" Information"} />
          {/* Contact form fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <ProfileInputTile
                name="firstName"
                value={formData.firstName}
                handleInputChange={handleInputChange}
                title="First Name"
                placeholder="First Name"
                required
              />

              <ProfileInputTile
                title="Last Name"
                name="lastName"
                value={formData.lastName}
                handleInputChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <ProfileInputTile
                title="Email"
                name="email"
                value={formData.email}
                handleInputChange={handleInputChange}
                type="email"
                placeholder="Email"
                required
              />
              <ProfileInputTile
                title={"Phone"}
                name="phone"
                value={formData.phone}
                handleInputChange={handleInputChange}
                type="tel"
                placeholder="Phone"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <Title text1={"Shipping"} text2={" Address"} />
          {/* Address form fields */}
          <div className="flex  flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <ProfileInputTile
                title="Door No"
                name="doorNo"
                value={formData.doorNo}
                handleInputChange={handleInputChange}
                placeholder="Door No"
                required
              />
              <ProfileInputTile
                title={"Address"}
                name="address"
                value={formData.address}
                handleInputChange={handleInputChange}
                placeholder="Street Address"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <ProfileInputTile
                title={"City"}
                name="city"
                value={formData.city}
                handleInputChange={handleInputChange}
                placeholder="City"
                required
              />
              <ProfileInputTile
                title={"State"}
                name="state"
                value={formData.state}
                handleInputChange={handleInputChange}
                placeholder="State"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <ProfileInputTile
                title={"PIN Code"}
                name="pincode"
                value={formData.pincode}
                handleInputChange={handleInputChange}
                placeholder="PIN Code"
                required
              />
              <ProfileInputTile
                title={"Country"}
                name="country"
                value={formData.country}
                handleInputChange={handleInputChange}
                placeholder="Country"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-xl">
            <Title text1={"Order"} text2={" Summary"} />
          </div>
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
                        className={`w-5 h-5 rounded-full border border-gray-300 ${colorMap[item.color]
                          }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">


              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <p className="font-medium">Original Price</p>
                  <p className="line-through text-gray-500">{formatCurrency(originalPrice)}</p>
                </div>
              )}


              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <p className="font-medium">
                    Discount{" "}
                    <span className="text-green-600 text-xs">
                      ({discountPercentage}%)
                    </span>
                  </p>
                  <p className="text-green-600">-{formatCurrency(totalDiscount)}</p>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSummary?.summary.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingfee}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{cartSummary?.summary.finalTotal + shippingfee}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-4">Payment Method</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("Prepaid");
                    setShippingFee(0);
                  }}
                  className={`border p-4 rounded flex-1 ${paymentMethod === "Prepaid" ? "border-orange-300" : ""
                    }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("COD");
                    setShippingFee(50);
                  }}
                  className={`border p-4 rounded flex-1 ${paymentMethod === "COD" ? "border-orange-300" : ""
                    }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center ">
              <img src={assets.payments_options} alt="" className="h-20 w-40" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-orange-300 text-black py-3 rounded-md  font-medium disabled:bg-orange-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

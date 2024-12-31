import React, { useEffect } from "react";
import { assets } from "../../assets/assets";
import { Title } from "../../components/Title";
import { useCartContext } from "../../context/CartContext";
import { useCollections } from "../../context/CollectionsContext";
import CartTotal from "../CartTotal";

function CartSlider({ cartVisible, setCartVisible }) {
  const {
    cartItems,
    cartItemsData,
    setCartItemsData,
    updateQuantity,
    navigate,
  } = useCartContext();
  const { fetchSpecificProduct } = useCollections();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      setError(null);
      const tempData = [];

      try {
        // Process items sequentially to maintain order
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              try {
                const productData = await fetchSpecificProduct(items);
                if (productData) {
                  tempData.push({
                    itemId: items,
                    size: item,
                    quantity: cartItems[items][item],
                    product: productData,
                  });
                }
              } catch (productError) {
                console.error(`Error fetching product ${items}:`, productError);
                // Continue with other products even if one fails
              }
            }
          }
        }
        setCartItemsData(tempData);
      } catch (error) {
        console.error("Error loading cart data:", error);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [cartItems]);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white transition-all duration-500 ${
        cartVisible ? "sm:w-[30%] w-[90%]" : "w-0 opacity-0"
      }`}
    >
      <div
        className={`sticky top-0 z-10 bg-white ${
          cartVisible ? "block" : "hidden"
        }`}
      >
        <div
          onClick={() => setCartVisible(false)}
          className="w-10 h-10 bg-orange-300 cursor-pointer gap-4 flex items-center justify-center group rounded-r-full my-2"
        >
          <img
            src={assets.cancel}
            alt=""
            className="h-3 group-hover:rotate-90 duration-300"
          />
        </div>
      </div>

      <div
        className={`flex flex-col gap-4 text-lg p-5 ${
          cartVisible ? "transition-all duration-1500 opacity-100" : "opacity-0"
        } `}
      >
        <Title text1="My " text2={` Cart`} />

        <div className={`px-2 mt-5 `}>
          {cartItemsData.length > 0 ? (
            cartItemsData.map((item, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700  gap-4 relative"
              >
                <div className="flex items-center justify-between w-full ">
                  <img
                    src={item.product.image}
                    alt=""
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium line-clamp-1 ">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {item.size}
                      </p>
                      <p className="text-md text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item.itemId,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="border max-w-20 max-h-10 px-1 sm:px-2 py-1"
                  />
                </div>
                <img
                  onClick={() => updateQuantity(item.itemId, item.size, 0)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer absolute right-0 top-2"
                  src={assets.bin_icon}
                  alt=""
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          )}
        </div>

        <div className="flex  justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />

            <div className="w-full text-end mt-5">
              <button
                onClick={() => {
                  navigate("/place-order");
                  setCartVisible(false);
                }}
                className="bg-black text-white px-10 py-3 text-sm"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSlider;

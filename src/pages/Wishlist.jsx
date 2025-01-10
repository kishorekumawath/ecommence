import React from "react";
import { Title } from "../components/Title";
import { ProductItemDesign2 } from "../components/ProductItem";
import { useWishlist } from "../context/WhislistContext";
import { useAuth } from "../context/NewAuthContext";

function Wishlist() {
  const {
    wishlistItems = [],
    loading,
    error,
    removeFromWishlist,
  } = useWishlist();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="px-10 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-10 min-h-[400px] flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Oops! Something went wrong</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-10 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Please login to view your wishlist
          </p>
        </div>
      </div>
    );
  }
  if (!wishlistItems) {
    return (
      <div className="px-10 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading wishlist...</p>
        </div>
      </div>
    );
  }
  if (wishlistItems.length === 0) {
    return (
      <div className="px-10 min-h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <Title text1="WISH" text2="LIST" />
          <div className="w-8 h-8 bg-black rounded-full text-white text-sm flex items-center justify-center">
            <p>0</p>
          </div>
        </div>
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Your wishlist is empty</p>
        </div>
      </div>
    );
  }

  // Handle clicking the like button
  const handleLikeClick = async (e, productId) => {
    e.preventDefault(); // Prevent navigation from Link component
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    }
  };

  return (
    <div className="px-10">
      <div className="flex justify-between items-center mb-8">
        <Title text1="WISH" text2="LIST" />
        <div className="w-8 h-8 bg-black rounded-full text-white text-sm flex items-center justify-center">
          <p>{wishlistItems.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {(wishlistItems || []).map((item) => {
          // Ensure we have all required product data
          const product = item?.product || {};
          if (!product._id) return null; // Skip rendering if no valid product

          return (
            <ProductItemDesign2
              key={product._id}
              id={product._id}
              name={product.name || ""}
              image={product.image || ""}
              price={product.price || 0}
              like={true}
              onLikeClick={(e) => handleLikeClick(e, product._id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;

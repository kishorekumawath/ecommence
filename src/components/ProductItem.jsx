import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductTitle } from "./Title";
import { IconButton } from "./icons";
import { assets } from "../assets/assets";
import { use } from "react";
import { s } from "framer-motion/client";

export function ProductItem({ id, name, image, price }) {
  // const { currency } = useContext(ShopContext);
  const currency = "₹";
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id} `}>
      <div>
        <div className="rounded-md  overflow-hidden">
          <img
            className="hover:scale-105 rounded-md transition ease-in-out h-64 sm:h-80 w-52 object-cover "
            src={image}
            alt=""
          />
        </div>

        <p className="pt-3 pb-1 text-md">{name}</p>
        <p className="text-lg font-semibold">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
}

// export function ProductItemDesign2({
//   id,
//   name,
//   image,
//   price,
//   like,
//   onLikeClick,
// }) {
//   const [liked, setLiked] = useState(false);

//   useEffect(() => {
//     setLiked(like);
//   }, [like]);

//   // Use the passed onLikeClick if provided, otherwise use the default behavior
//   const handleLikeClick = (e) => {
//     if (onLikeClick) {
//       onLikeClick(e);
//     } else {
//       e.preventDefault();
//       console.log("liked");
//       setLiked(!liked);
//     }
//   };

//   return (
//     <Link to={`/product/${id}`}>
//       <div className="w-52 sm:w-64 lg:w-72 rounded-lg group relative flex-shrink-1 overflow-hidden">
//         <img
//           src={image}
//           alt=""
//           className="rounded-lg group-hover:scale-110 transition ease-in-out overflow-hidden"
//         />
//         <div className="flex justify-between absolute top-4 left-5 right-5">
//           <IconButton
//             iconPath={liked ? assets.like : assets.unLike}
//             onClick={handleLikeClick}
//           />
//         </div>
//       </div>
//       <ProductTitle name={name} price={price} />
//     </Link>
//   );
// }

import { ImageOff } from "lucide-react";

const ProductItemDesign2 = ({ id, name, image, price, like, onLikeClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group w-full max-w-sm">
      <div className="relative">
        {/* Image Container with fixed aspect ratio */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
          {!imageError && image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center text-gray-400">
                <ImageOff size={48} />
                <span className="mt-2 text-sm">No image available</span>
              </div>
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={onLikeClick}
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
        >
          <svg
            className={`w-5 h-5 ${
              like ? "fill-red-500" : "fill-none"
            } stroke-current`}
            viewBox="0 0 24 24"
            stroke={like ? "rgb(239, 68, 68)" : "black"}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium truncate">{name}</h3>
        <p className="text-sm font-bold">${price?.toFixed(2) || "0.00"}</p>
      </div>
    </div>
  );
};
export { ProductItemDesign2 };

export function CollectionCategoryItem({ title, img, onClick }) {
  return (
    <div>
      <div
        onClick={onClick}
        className="relative aspect-square group bg-gray-300 rounded-lg flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={img}
            alt={title}
            className="object-cover h-full w-full group-hover:scale-125 transition ease-in-out"
          />
        </div>
      </div>
      <p className="text-lg text-gray mt-2">{title}</p>
    </div>
  );
}

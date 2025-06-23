import { Link } from "react-router-dom";
import { ProductTitle } from "./Title";
import { IconButton } from "./icons";
import { assets } from "../assets/assets";
import { useCartContext } from "../context/CartContext";
import { colorMap } from "../context/CollectionsContext";
export function ProductItem({
  id,
  name,
  image,
  price,
  like,
  onLikeClick,
  className = "",
  onClick,
  colors,
  reduceIconSize = false,
  fromWishlist = false,
}) {
  const { extraCharge } = useCartContext();

  return (
    <div
      className={`relative ${className} cursor-pointer w-full border border-gray-300 rounded-md overflow-hidden `}
      onClick={onClick}
      id={id}
    >
      <div className="w-full rounded-t-md overflow-hidden relative">
        <img
          className="hover:scale-105 w-full rounded-t-md transition ease-in-out h-60 md:h-52 lg:h-60 xl:h-80 object-cover"
          src={image}
          alt=""
        />
        {colors?.length > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full shadow-sm">
            {colors.slice(0, 2).map((code, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border border-white ${colorMap[code]}`}
              />
            ))}
            {colors.length > 2 && (
              <span className="text-xs text-gray-700 font-medium pl-1">
                +{colors.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="px-2">
        <p className="pt-2 pb-1 text-sm truncate">{name}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold text-black">₹{price}</p>
        <div className="flex-col">
          <p className="text-xs text-gray-500">
            MRP:{" "}
            <span className="line-through text-gray-600 font-medium">
              {`₹ ${price + extraCharge}`}
            </span>
          </p>
          <p className="text-xs text-green-600 font-semibold ">
            {Math.round((extraCharge / (price + extraCharge)) * 100)}% OFF
          </p>
        </div>

      </div>

      </div>

      

      <div className="flex justify-between absolute top-2 right-2 ">
        <IconButton
          reduceIconSize={reduceIconSize}
          iconPath={like ? fromWishlist ? assets.cancel : assets.like : assets.unLike}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLikeClick(e);
          }}
        />
      </div>
    </div>
  );
}

export function ProductItemDesign2({
  id,
  name,
  image,
  price,
  like,
  onLikeClick,
}) {
  // Remove the local liked state - we'll use the prop directly

  return (
    <Link to={`/product/${id}`}>
      <div className="w-52 sm:w-64 lg:w-72 rounded-lg group relative flex-shrink-1 overflow-hidden">
        <img
          src={image}
          alt=""
          className="rounded-lg group-hover:scale-110 transition ease-in-out overflow-hidden"
        />
        <div className="flex justify-between absolute top-4 left-5 right-5">
          <IconButton
            iconPath={like ? assets.like : assets.unLike}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLikeClick(e);
            }}
          />
        </div>
      </div>
      <ProductTitle name={name} price={price} />
    </Link>
  );
}
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
      <p className="text-sm md:text-lg text-gray mt-2">{title}</p>
    </div>
  );
}

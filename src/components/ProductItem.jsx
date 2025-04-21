import { Link } from "react-router-dom";
import { ProductTitle } from "./Title";
import { IconButton } from "./icons";
import { assets } from "../assets/assets";

export function ProductItem({
  id,
  name,
  image,
  price,
  like,
  onLikeClick,
  className = "",
}) {
  const currency = "₹";
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id} `}>
      <div className={`relative ${className}`}>
        <div className="w-full rounded-md  overflow-hidden">
          <img
            className="hover:scale-105 w-full rounded-md transition ease-in-out h-60 md:h-52 lg:h-60 xl:h-96 object-cover "
            src={image}
            alt=""
          />
        </div>

        <p className="pt-3 pb-1 text-md">{name}</p>
        <p className="text-lg font-semibold">
          {currency}
          {price}
        </p>

        <div className="flex justify-between absolute top-2 right-2 ">
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
    </Link>
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

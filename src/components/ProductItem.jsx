import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductTitle } from "./Title";
import { IconButton } from "./icons";
import { assets } from "../assets/assets";

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

export function ProductItemDesign2({ id, name, image, price }) {
  const [liked, setLiked] = useState(false);

  const onLikeClick = (e) => {
    e.preventDefault();
    console.log("liked");
    setLiked(!liked);
  };
  return (
    <Link to={`/product/${id}`}>
      <div className="w-52 sm:w-64 lg:w-72  rounded-lg group relative flex-shrink-1 overflow-hidden">
        <img
          src={image}
          alt=""
          className="rounded-lg group-hover:scale-110 transition ease-in-out overflow-hidden"
        />
        <div className="flex justify-between absolute top-4 left-5 right-5  ">
          <IconButton
            iconPath={liked ? assets.like : assets.unLike}
            onClick={onLikeClick}
          />
          {/* <IconButton iconPath={assets.cart_icon} /> */}
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
      <p className="text-lg text-gray mt-2">{title}</p>
    </div>
  );
}

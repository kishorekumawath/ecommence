import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductTitle } from "./Title";
import { IconButton } from "./icons";
import { assets } from "../assets/assets";

export function ProductItem({ id, name, image, price }) {
  // const { currency } = useContext(ShopContext);
  const currency = "$";
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt=""
        />
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
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
    <Link to={`/product/${id}`} className=" border p-1 rounded-lg">
      <div className="w-52 sm:w-64 lg:w-72  rounded-lg group relative flex-shrink-1 overflow-hidden">
        <img
          src={image}
          alt=""
          className="rounded-lg  group-hover:scale-110 transition ease-in-out overflow-hidden"
        />
        <div className="flex justify-between absolute top-4 left-5 right-5  ">
          <IconButton
            iconPath={liked ? assets.like : assets.unLike}
            onClick={onLikeClick}
          />
          <IconButton iconPath={assets.cart_icon} />
        </div>
      </div>
      <ProductTitle name={name} price={price} />
    </Link>
  );
}

export function CollectionCategoryItem({
  title,
  img,
  categoryId,
  categoryName,
}) {
  const navigate = useNavigate();
  // console.log("CollectionCategoryItem", categoryId);
  const handleClick = () => {
    navigate(`/collection/${categoryId}`);
  };

  return (
    // card holder

    <div>
      <div
        onClick={handleClick}
        className="relative h-40 group  bg-gray-300 rounded-lg flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer"
      >
        {/* image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={img}
            alt=""
            className="object-cover h-full w-full group-hover:scale-125 transition ease-in-out "
          />
        </div>

        {/* overllay
        <div className='absolute inset-0 bg-black/30 rounded-lg hover:backdrop-blur-sm transition-all ease-in-out'></div> */}

        {/* title
        <p className="absolute font-light bottom-0 border bg-white px-4 py-1  rounded-b-lg left-1/2 -translate-x-1/2 text-gray text-sm lg:text-md   opacity-100 translate-y-full transition-all ease-out duration-300 select-none ">
          {title}
        </p> */}
      </div>
      <p className="text-lg text-gray "> {title}</p>
    </div>
  );
}

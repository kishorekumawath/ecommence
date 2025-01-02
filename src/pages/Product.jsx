import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, products } from "../assets/assets";
import { useCollections } from "../context/CollectionsContext";
import { useCartContext } from "../context/CartContext";
import ReviewBox from "../components/ReviewBox";

const colorMap = {
  Yl: "bg-yellow-400",
  Wh: "bg-white",
  BB: "bg-blue-200",
  SG: "bg-gray-400",
  Sb: "bg-sky-400",
  Rb: "bg-blue-600",
  Rd: "bg-red-500",
  Pu: "bg-purple-500",
  Pb: "bg-blue-800",
  Ph: "bg-orange-200",
  Or: "bg-orange-500",
  OG: "bg-olive-600",
  NYl: "bg-yellow-300",
  Nb: "bg-navy-800",
  MYl: "bg-yellow-600",
  Mh: "bg-stone-400",
  Mnt: "bg-green-200",
  Mn: "bg-red-800",
  LBp: "bg-pink-200",
  Lv: "bg-purple-200",
  Jd: "bg-emerald-400",
  Gm: "bg-gray-300",
  GYl: "bg-yellow-500",
  Fgn: "bg-green-600",
  Cor: "bg-orange-400",
  Cop: "bg-amber-600",
  Bn: "bg-brown-700",
  Cm: "bg-gray-600",
  BRd: "bg-red-700",
  Gn: "bg-green-800",
  Bk: "bg-black",
  Be: "bg-amber-100",
  Fl: "bg-pink-500",
};

const bottomSection = ["Description", "Additional Information", "Reviews"];

function Product() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { fetchSpecificProduct, calculateReview } = useCollections();
  const { addToCart } = useCartContext();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBottomSection, setSelectedBottomSection] = useState(
    bottomSection[0]
  );
  const [overAllReview, setOverAllReview] = useState([0, 0]);
  const fetchProductData = async () => {
    setIsLoading(true);
    await fetchSpecificProduct(productId).then((data) => {
      setProduct(data);
      setImage(data.image);
      const reviewScore = calculateReview(data);
      // Ensure we have valid numbers for the star display
      setOverAllReview([
        Math.max(0, Math.min(5, Math.floor(reviewScore[0] || 0))),
        Math.max(0, Math.min(5, Math.floor(reviewScore[1] || 0))),
      ]);

      setIsLoading(false);
    });
  };
  // Helper function to render stars
  const renderStars = (filledStars, totalStars = 5) => {
    return Array.from({ length: totalStars }, (_, index) => (
      <img
        key={index}
        src={index < filledStars ? assets.star_icon : assets.star_dull_icon}
        alt={index < filledStars ? "filled star" : "empty star"}
        className="w-3"
      />
    ));
  };
  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const OriginalToSlug = (subcategory) => {
    // const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, "-");
    return subcategorySlug;
  };
  const ColorSelector = ({ colors = [], selectedColor, onColorSelect }) => (
    <div>
      <p className="mt-5 text-gray-500 md:w-4/5">Select Color</p>
      <div className="flex gap-4 my-4">
        {colors.map((colorCode) => (
          <button
            key={colorCode}
            onClick={() => onColorSelect(colorCode)}
            className={`border h-10 w-10 ${colorMap[colorCode]} rounded-md ${
              selectedColor === colorCode ? "ring-2  ring-orange-300" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
  const handleAddToCart = () => {
    if (!size) {
      console.log("size is required");
      return;
    }

    if(!selectedColor){
      console.log("color is required");
      return;
    }

    // let cartObject = {
    //   id: product._id,
    //   size:
    // }
    addToCart(product._id, size,selectedColor,product);


  };

  const ProductSkeleton = () => (
    <div className="border-t-2 pt-5 sm:pt-10 px-4 sm:px-10">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 sm:flex-row animate-pulse">
        {/* Small images - hidden on mobile */}
        <div className="hidden sm:flex sm:flex-col w-[10vw] gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-20 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Main image */}
        <div className="w-full sm:w-[40%]">
          <div className="w-full aspect-square sm:h-[600px] bg-gray-200 rounded" />
        </div>

        {/* Product info */}
        <div className="flex-1 mt-4 sm:mt-0">
          <div className="h-6 sm:h-8 w-full sm:w-2/3 bg-gray-200 rounded mb-4" />

          {/* Stars */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
            ))}
            <div className="w-8 h-3 bg-gray-200 rounded ml-2" />
          </div>

          <div className="h-6 sm:h-8 w-20 bg-gray-200 rounded mt-4" />
          <div className="h-16 sm:h-20 w-full sm:w-4/5 bg-gray-200 rounded mt-4" />

          {/* Size buttons */}
          <div className="flex gap-2 sm:gap-4 my-6 sm:my-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 sm:h-10 w-14 sm:w-16 bg-gray-200 rounded"
              />
            ))}
          </div>

          {/* Color buttons */}
          <div className="flex gap-3 sm:gap-4 my-6 sm:my-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
            ))}
          </div>

          <div className="h-10 sm:h-12 w-32 bg-gray-200 rounded" />
          <hr className="mt-6 sm:mt-8 w-full sm:w-4/5" />

          {/* Product features */}
          <div className="mt-4 sm:mt-5 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-3 sm:h-4 w-full sm:w-3/4 bg-gray-200 rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mt-10 sm:mt-20">
        <div className="flex">
          <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded" />
          <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded ml-2" />
          <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded ml-2" />
        </div>
        <div className="border px-4 sm:px-6 py-4 sm:py-6 mt-2">
          <div className="space-y-3 sm:space-y-4">
            <div className="h-3 sm:h-4 w-full bg-gray-200 rounded" />
            <div className="h-3 sm:h-4 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="border-t-2  pt-10 px-6 transition-opacity ease-in duration-500 opacity-100 ">
      {/* breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate("/")} className="hover:text-gray-900">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() =>
            navigate(
              `/collection/${OriginalToSlug(
                product?.category?.parentCategory?.name
              )}/${OriginalToSlug(product?.category?.name)}`
            )
          }
          className="hover:text-gray-900 capitalize line-clamp-1"
        >
          {product?.category?.name}
        </button>
        <span>/</span>
        <span className="text-gray-900 line-clamp-1">{product?.name}</span>
      </div>
      {/* ---------------- product info ----------------- */}
      <div className="flex-1 flex flex-col gap-3 sm:flex-row ">
        {/* Mobile layout: Main image first, then additional images */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-1/2">
          {/* Main Image */}
          <div className="w-full sm:w-[70%] h-[90%] sm:h-[70%] overflow-hidden order-1 sm:order-2">
            <img
              className="w-full object-cover rounded-md"
              src={image}
              alt={product?.name || "Product image"}
            />
          </div>

          {/* Additional Images - Now below main image on mobile */}
          <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:h-[600px] w-full sm:w-[20%] pb-4 sm:pb-0 order-2 sm:order-1">
            {product?.addImages?.map((img, index) => (
              <img
                onClick={() => setImage(img)}
                src={img}
                key={index}
                className="w-[80px] sm:w-full h-[80px] sm:h-auto object-cover flex-shrink-0 cursor-pointer rounded-md hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* ---------------- product information ------------------ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product?.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(overAllReview[0])}
            <p className="pl-2">{product?.reviews?.length || 0}</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{`$ ${product?.price}`}</p>
          <p className="mt-2 text-gray-500">
            MRP:{" "}
            <span className="line-through text-gray-700 font-semibold">
              {product?.price + 500}
            </span>{" "}
            Inclusive of all Taxes
          </p>

          <div className="flex  gap-4 my-8">
            {product?.size?.map((item, index) => (
              <button
                onClick={() => setSize(item)}
                key={index}
                className={`border bg-gray-100 py-2 px-4 rounded-md ${
                  item === size ? "ring-2 ring-orange-300 text-black" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <ColorSelector
            colors={product?.color || []}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          <button
            onClick={handleAddToCart} // handleAddToCart function
            className=" text-black w-full px-8 py-3 mb-2 sm:w-auto text-sm active:bg-gray-700 mr-5 bg-orange-300 rounded-md"
          >
            BUY NOW
          </button>

          <button
            onClick={handleAddToCart} // handleAddToCart function
            className="bg-black w-full sm:w-auto text-white px-8 py-3 text-sm active:bg-gray-700 rounded-md"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            {product?.details.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------ Description, add info & review sections  --------------------*/}
      <div className="mt-10">
        <div className="flex w-full sm:w-auto overflow-hidden">
          <p
            onClick={() => setSelectedBottomSection(bottomSection[0])}
            className={` w-full sm:w-auto border px-2 py-2 text-sm ${
              selectedBottomSection === bottomSection[0]
                ? "font-semibold"
                : "font-light"
            } cursor-pointer`}
          >
            Description
          </p>
          <p
            onClick={() => setSelectedBottomSection(bottomSection[1])}
            className={`w-full sm:w-auto border px-2 py-2 text-sm ${
              selectedBottomSection === bottomSection[1]
                ? "font-semibold"
                : "font-light"
            } cursor-pointer`}
          >
            Additional Information
          </p>
          <p
            onClick={() => setSelectedBottomSection(bottomSection[2])}
            className={`w-full sm:w-auto border px-2 py-2 text-sm ${
              selectedBottomSection === bottomSection[2]
                ? "font-semibold"
                : "font-light"
            } cursor-pointer`}
          >
            Reviews
          </p>
        </div>
        {/* Content container */}
        <div className="w-full">
          {selectedBottomSection === bottomSection[0] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 w-full">
              {product.description.split(".").map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          )}

          {selectedBottomSection === bottomSection[1] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
              <p>{product.addInfo}</p>
            </div>
          )}
          {selectedBottomSection === bottomSection[2] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
              {product.reviews.map((review, index) => (
                <ReviewBox key={index} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Product;

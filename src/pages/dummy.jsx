import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, products } from "../assets/assets";
import { colorMap, useCollections } from "../context/CollectionsContext";
import { useCartContext } from "../context/CartContext";
import ReviewBox from "../components/ReviewBox";
import { SizeChartModal } from "../components/SizeChartModal";
import { ToastContainer, toast } from "react-toastify";

const bottomSection = ["Description", "Additional Information", "Reviews"];

function Product() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { fetchSpecificProduct, fetchProductColorImages, calculateReview, getProductAvailableColors, getColorImageCount } = useCollections();
  const { addToCart, extraCharge } = useCartContext();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colorImages, setColorImages] = useState([]); // Images for selected color
  const [loadingColorImages, setLoadingColorImages] = useState(false);
  const [availableColors, setAvailableColors] = useState([]); // Available colors from colorImages array

  const [selectedBottomSection, setSelectedBottomSection] = useState(
    bottomSection[0]
  );
  const [overAllReview, setOverAllReview] = useState([0, 0]);

  // Handle color selection and fetch color-specific images
  const handleColorSelect = async (colorCode) => {
    if (colorCode === selectedColor) return; // Don't fetch if same color is selected
    
    setSelectedColor(colorCode);
    setLoadingColorImages(true);
    
    try {
      const result = await fetchProductColorImages(productId, colorCode);
      
      if (result.success) {
        setColorImages(result.images);
        setImage(result.images[0]); // Set first image as main image
        toast.success(`Loaded ${result.totalImages} images for selected color`);
      } else {
        toast.error(result.message || "Failed to load color images");
        // Fallback to finding images from product's colorImages array
        const fallbackImages = findColorImagesFromProduct(product, colorCode);
        setColorImages(fallbackImages);
        setImage(fallbackImages[0] || product.image);
      }
    } catch (error) {
      console.error("Error fetching color images:", error);
      toast.error("Failed to load color images");
      // Fallback to finding images from product's colorImages array
      const fallbackImages = findColorImagesFromProduct(product, colorCode);
      setColorImages(fallbackImages);
      setImage(fallbackImages[0] || product.image);
    } finally {
      setLoadingColorImages(false);
    }
  };

  // Helper function to find images from product's colorImages array
  const findColorImagesFromProduct = (product, colorCode) => {
    if (product.colorImages && Array.isArray(product.colorImages)) {
      const colorEntry = product.colorImages.find(entry => entry.color === colorCode);
      return colorEntry ? colorEntry.images : [product.image];
    }
    return [product.image];
  };

  // Get available colors from the colorImages array
  const getAvailableColorsFromProduct = (product) => {
    if (product.colorImages && Array.isArray(product.colorImages)) {
      return product.colorImages.map(entry => entry.color);
    }
    return product.color || []; // Fallback to the main color field
  };

  // Get image count for a specific color
  const getImageCountForColor = (product, colorCode) => {
    if (product.colorImages && Array.isArray(product.colorImages)) {
      const colorEntry = product.colorImages.find(entry => entry.color === colorCode);
      return colorEntry ? colorEntry.images.length : 0;
    }
    return 0;
  };

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSpecificProduct(productId);
      console.log(data);
      setProduct(data);
      setImage(data.image);
      
      // Get available colors from colorImages array
      const colors = getAvailableColorsFromProduct(data);
      setAvailableColors(colors);
      
      // Auto-select first available color and fetch its images
      if (colors.length > 0) {
        const firstColor = colors[0];
        setSelectedColor(firstColor);
        
        // Get images for the first color from colorImages array
        const firstColorImages = findColorImagesFromProduct(data, firstColor);
        setColorImages(firstColorImages);
        
        // Set main image to first image of selected color
        if (firstColorImages.length > 0) {
          setImage(firstColorImages[0]);
        }
        
        // Optionally fetch from API to ensure we have the latest images
        try {
          const result = await fetchProductColorImages(productId, firstColor);
          if (result.success) {
            setColorImages(result.images);
            setImage(result.images[0]);
          }
        } catch (error) {
          console.log("API fetch failed, using local images:", error);
          // Already set from local data above
        }
      } else if (data.addImages && data.addImages.length > 0) {
        // If no color-specific images, use addImages
        setColorImages(data.addImages);
      } else {
        // Fallback to main image
        setColorImages([data.image]);
      }
      
      const reviewScore = calculateReview(data);
      setOverAllReview([
        Math.max(0, Math.min(5, Math.floor(reviewScore[0] || 0))),
        Math.max(0, Math.min(5, Math.floor(reviewScore[1] || 0))),
      ]);

    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed to load product data");
    } finally {
      setIsLoading(false);
    }
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
            disabled={loadingColorImages}
            className={`border h-10 w-10 ${colorMap[colorCode]} rounded-md ${
              selectedColor === colorCode ? "ring-2 ring-orange-300" : ""
            } ${loadingColorImages ? "opacity-50 cursor-not-allowed" : "hover:ring-1 hover:ring-gray-300"}`}
          />
        ))}
      </div>
      {/* Display count of images for selected color */}
      {selectedColor && (
        <div className="text-xs text-gray-400 mt-1">
          {loadingColorImages ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-300"></div>
              Loading images...
            </span>
          ) : (
            <span>
              {colorImages.length} image{colorImages.length !== 1 ? 's' : ''} available
              {(() => {
                const count = getImageCountForColor(product, selectedColor);
                return count > 0 ? ` (${count} total for this color)` : '';
              })()}
            </span>
          )}
        </div>
      )}
    </div>
  );

  function getStockStatus(stock) {
    if (stock <= 0) {
      return <span className="text-red-500">Out of Stock</span>;
    } else if (stock > 0 && stock <= 10) {
      return <span className="text-yellow-500"> Only {stock} Left</span>;
    } else if (stock > 10 && stock <= 20) {
      return <span className="text-orange-500">Hurry Up</span>;
    } else {
      return <span className="text-green-500">In Stock</span>;
    }
  }

  const handleBuyNow = () => {
    if (!size) {
      toast.warn("Size is required");
      return;
    }

    if (!selectedColor) {
      toast.warn("Color is required");
      return;
    }

    const itemTotal = product.price * 1;

    const cartSummary = {
      items: [
        {
          id: product._id,
          name: product.name,
          sku: product.sku,
          quantity: 1,
          price: product.price,
          size: size,
          color: selectedColor,
          image: image,
          subtotal: itemTotal,
        },
      ],
      summary: {
        totalAmount: itemTotal,
        itemCount: 1,
        finalTotal: itemTotal,
      },
      orderDetails: {
        createdAt: new Date().toISOString(),
        currency: "INR",
        status: "pending",
        isBuyNow: true,
      },
    };

    navigate("/place-order", {
      state: { cartSummary, isBuyNow: true },
      replace: false,
    });
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Size is required");
      return;
    }

    if (!selectedColor) {
      toast.warn("Color is required");
      return;
    }

    addToCart(product._id, size, selectedColor, product);
  };

  const ProductSkeleton = () => (
    <div className="border-t-2 pt-5 sm:pt-10 px-4 sm:px-10">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 sm:flex-row animate-pulse">
        {/* Small images */}
        <div className="hidden sm:flex sm:flex-col w-[10vw] gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-20 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Main image */}
        <div className="w-full sm:w-[40%]">
          <div className="w-full aspect-square sm:h-[600px] bg-gray-200 rounded" />
        </div>
        {/* Product info skeleton */}
        <div className="flex-1 mt-4 sm:mt-0 space-y-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-20 w-4/5 bg-gray-200 rounded" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-16 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="border-t-2 pt-10 px-6 transition-opacity ease-in duration-500 opacity-100">
      {/* Breadcrumb */}
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
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-2 sm:flex-row">
        {/* Image Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-[50%] lg:w-[40%]">
          {/* Main Image */}
          <div className="w-full sm:w-[70%] h-[90%] sm:h-[70%] lg:h-full overflow-hidden order-1 sm:order-2">
            <img
              className="w-full object-cover rounded-md"
              src={image}
              alt={product?.name || "Product image"}
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:h-[600px] w-full sm:w-[20%] pb-4 sm:pb-0 order-2 sm:order-1">
            {loadingColorImages ? (
              // Loading skeleton for thumbnails
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[80px] sm:w-full h-[80px] sm:h-auto bg-gray-200 rounded-md animate-pulse flex-shrink-0"
                />
              ))
            ) : (
              colorImages.map((img, index) => (
                <img
                  onClick={() => setImage(img)}
                  src={img}
                  key={index}
                  className={`w-[80px] sm:w-full h-[80px] sm:h-auto object-cover flex-shrink-0 cursor-pointer rounded-md hover:opacity-80 transition-opacity ${
                    image === img ? 'ring-2 ring-orange-300' : ''
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{product?.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(overAllReview[0])}
            <p className="pl-2">{product?.reviews?.length || 0}</p>
          </div>
          <div className="mt-4">
            <p>{getStockStatus(product?.stock)}</p>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-medium text-gray-800">{`₹ ${product?.price}`}</p>
              <p className="text-sm text-gray-500">
                MRP:{" "}
                <span className="line-through text-gray-600 font-medium">
                  {`₹ ${product?.price + extraCharge}`}
                </span>
              </p>
            </div>
            <p className="mt-1 text-green-600 font-semibold">
              You save{" "}
              {Math.round((extraCharge / (product?.price + extraCharge)) * 100)}
              %!
            </p>
            <p className="mt-1 text-gray-500 text-xs">Inclusive of all Taxes</p>
          </div>

          <p className="mt-2 mb-3 py-2 text-sm text-gray-500 italic">
            Please refer to size chart from images for accurate measurements
          </p>
          
          {/* Size Selection */}
          <div className="flex gap-4 my-2">
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
          
          {/* Color Selection - Now uses availableColors from colorImages array */}
          <ColorSelector
            colors={availableColors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
          
          <ToastContainer />

          {/* Action Buttons */}
          <button
            onClick={handleBuyNow}
            className="text-black w-full px-8 py-3 mb-2 sm:w-auto text-sm active:bg-gray-700 mr-5 bg-orange-300 rounded-md"
          >
            BUY NOW
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-black w-full sm:w-auto text-white px-8 py-3 text-sm active:bg-gray-700 rounded-md"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            {product?.details?.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>
      
      {isModalOpen && <SizeChartModal setIsModalOpen={setIsModalOpen} />}
      
      {/* Bottom Sections */}
      <div className="mt-10">
        <div className="flex w-full sm:w-auto overflow-hidden">
          {bottomSection.map((section, index) => (
            <p
              key={section}
              onClick={() => setSelectedBottomSection(section)}
              className={`w-full sm:w-auto border px-2 py-2 text-sm ${
                selectedBottomSection === section ? "font-semibold" : "font-light"
              } cursor-pointer`}
            >
              {section}
            </p>
          ))}
        </div>
        
        <div className="w-full">
          {selectedBottomSection === bottomSection[0] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 w-full">
              {product.description?.split(".").map((item, index) => (
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
              {product.reviews?.map((review, index) => (
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
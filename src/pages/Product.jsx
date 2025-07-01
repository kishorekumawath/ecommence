import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Local assets and product data (consider if these should be fetched from an API)
import { assets } from "../assets/assets";
// Contexts for global state management
import { colorMap, useCollections } from "../context/CollectionsContext";
import { useCartContext } from "../context/CartContext";
import { useWishlist } from "../context/WhislistContext";
// UI Components
import ReviewBox from "../components/ReviewBox";
import { SizeChartModal } from "../components/SizeChartModal"; // Note: This component is currently commented out in the JSX
import { ToastContainer, toast } from "react-toastify";
import { LikeButton, ShareButton } from "../components/icons";
import ImageViewModal from "../components/ImageViewModal";
import { ProductItem } from "../components/ProductItem";

// Defines the sections for the product's bottom panel (Description, Additional Information, Reviews)
const bottomSection = ["Description", "Additional Information", "Reviews"];

/**
 * Product Component
 *
 * This component displays detailed information about a single product,
 * including images, price, size and color selection, and reviews.
 * It also handles adding products to the cart and wishlist, and navigating
 * to the checkout process.
 */
function Product() {
  // Hooks for navigation, route parameters, and context API
  const navigate = useNavigate();
  const { productId } = useParams(); // Extracts product ID from the URL
  const { fetchSpecificProduct, calculateReview, fetchProductColorImages } =
    useCollections(); // Custom hook for collection-related data
  const { addToCart, extraCharge } = useCartContext(); // Custom hook for cart management
  const {
    wishlistItems = [], // Destructure wishlist items, providing an empty array as a fallback
    addToWishlist,
    removeFromWishlist,
  } = useWishlist() || {}; // Custom hook for wishlist management, providing an empty object as a fallback

  // --- State Variables ---
  const [product, setProduct] = useState({}); // Stores the fetched product data
  const [image, setImage] = useState(""); // Currently displayed main product image
  const [size, setSize] = useState(""); // Selected product size
  const [selectedColor, setSelectedColor] = useState(""); // Selected product color
  const [isLoading, setIsLoading] = useState(true); // Manages loading state for product data
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls visibility of the SizeChartModal
  const [relatedProducts, setRelatedProducts] = useState([]); // Stores related products
  const [colorImages, setColorImages] = useState([]); // Images for selected color
  const [loadingColorImages, setLoadingColorImages] = useState(false);

  const [selectedBottomSection, setSelectedBottomSection] = useState(
    bottomSection[0]
  ); // Controls which section (Description, Add Info, Reviews) is active
  const [overAllReview, setOverAllReview] = useState([0, 0]); // Stores calculated overall review score and count

  // --- Image View Modal States ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Controls visibility of the ImageViewModal
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the currently displayed image in the modal
  const [allImages, setAllImages] = useState([]); // Array of all product images (main + additional)
  const touchStartX = useRef(0); // Stores initial X coordinate for touch swipe gestures
  const touchEndX = useRef(0); // Stores final X coordinate for touch swipe gestures

  // --- Helper Functions ---

  /**
   * Handles the click event on an image to open the image view modal.
   * @param {string} clickedImage - The URL of the image that was clicked.
   */
  const handleImageClick = (clickedImage) => {
    // Find the index of the clicked image within the `allImages` array
    const imageIndex = allImages.findIndex((img) => img === clickedImage);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0); // Set current index, default to 0 if not found
    setIsImageModalOpen(true); // Open the image view modal
  };

  /**
   * Handles the selection of a product color, and updates the main displayed image accordingly.
   * @param {string} colorCode - The code of the selected color.
   */
  const handleColorSelect = async (colorCode, productImage) => {
    if (colorCode === selectedColor) return; // Don't fetch if same color is selected

    setSelectedColor(colorCode);
    setLoadingColorImages(true);



    try {
      const result = await fetchProductColorImages(productId, colorCode);

      if (result.success && result.images && result.images.length > 0) {
        setColorImages(result.images);
        setImage(result.images[0]); // Set first image as main image
      } else {
        setColorImages([productImage]);
        setImage(productImage); // Set product image as main image
        // console.log("Failed to fetch color images", product.image);
      }
    } catch (error) {
      setColorImages([productImage]);
      setImage(productImage);
      console.error("Error fetching color images:", error);
    } finally {
      setLoadingColorImages(false);
    }
  };

  /**
   * Fetches product data from the backend based on the `productId` from URL parameters.
   * Sets product details, initial image, selected color, and calculates review scores.
   */
  const fetchProductData = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await fetchSpecificProduct(productId);
      const data = await response;
      setProduct(data);
      await handleColorSelect(data.color[0], data.image);
      setRelatedProducts(response.recommendations);
      // Set initial color
      // Auto-select the first available color and try to find a matching image
      if (data.color && data.color.length > 0) {
        const firstColor = data.color[0];
        setSelectedColor(firstColor);
      }

      // Calculate and set overall review scores
      const reviewScore = calculateReview(data);
      setOverAllReview([
        Math.max(0, Math.min(5, reviewScore[0] || 0)), // Clamp score between 0 and 5
        Math.max(0, Math.min(5, reviewScore[1] || 0)), // Clamp score between 0 and 5
      ]);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      toast.error("Failed to load product data.");
    } finally {

      setIsLoading(false); // Set loading to false after fetching
    }
  };

  /**
   * Renders star icons based on the number of filled stars.
   * @param {number} filledStars - The number of stars to be filled.
   * @param {number} totalStars - The total number of stars to render (default is 5).
   * @returns {JSX.Element[]} An array of image elements representing stars.
   */
  const renderStars = (filledStars, totalStars = 5) => {
    return Array.from({ length: totalStars }, (_, index) => (
      <img
        key={index}
        src={
          index < Math.floor(filledStars)
            ? assets.star_icon // Filled star
            : assets.star_dull_icon // Empty star
        }
        alt={index < Math.floor(filledStars) ? "filled star" : "empty star"}
        className="w-3"
      />
    ));
  };

  /**
   * Converts a string (e.g., subcategory name) into a URL-friendly slug.
   * @param {string} subcategory - The string to convert.
   * @returns {string} The slugified string.
   */
  const OriginalToSlug = (subcategory) => {
    return subcategory.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with hyphens
  };

  /**
   * Helper component for selecting product colors.
   * @param {Object} props - Component props.
   * @param {string[]} props.colors - Array of color codes.
   * @param {string} props.selectedColor - The currently selected color code.
   * @param {function} props.onColorSelect - Callback function when a color is selected.
   * @returns {JSX.Element} The ColorSelector component.
   */
  const ColorSelector = ({ colors = [], selectedColor, onColorSelect }) => (
    <div>
      <p className="mt-5 text-gray-500 md:w-4/5">Select Color</p>
      <div className="flex gap-4 my-4">
        {colors.map((colorCode) => (
          <button
            key={colorCode}
            onClick={() => onColorSelect(colorCode)}
            // Dynamically apply background color and ring based on selection
            className={`border h-10 w-10 ${colorMap[colorCode]} rounded-md ${selectedColor === colorCode ? "ring-2 ring-orange-300" : ""
              }`}
            aria-label={`Select color ${colorCode}`}
          />
        ))}
      </div>
    </div>
  );

  /**
   * Determines and returns the stock status message and styling.
   * @param {number} stock - The current stock quantity of the product.
   * @returns {JSX.Element} A styled span indicating the stock status.
   */
  function getStockStatus(stock) {
    if (stock <= 0) {
      return <span className="text-red-500">Out of Stock</span>;
    } else if (stock > 0 && stock <= 10) {
      return <span className="text-yellow-500">Only {stock} Left</span>;
    } else if (stock > 10 && stock <= 20) {
      return <span className="text-orange-500">Hurry Up</span>;
    } else {
      return <span className="text-green-500">In Stock</span>;
    }
  }

  /**
   * Handles the "Buy Now" action. Validates size and color,
   * creates a cart summary, and navigates to the place order page.
   */
  const handleBuyNow = () => {
    if (!size) {
      toast.warn("Please select a size.");
      return;
    }
    if (!selectedColor) {
      toast.warn("Please select a color.");
      return;
    }

    const itemTotal = product.price * 1; // Quantity is always 1 for buy now

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
        isBuyNow: true, // Flag to indicate a direct purchase
      },
    };

    // Navigate to the place order page with cart summary data
    navigate("/place-order", {
      state: { cartSummary, isBuyNow: true },
      replace: false,
    });
  };

  /**
   * Handles the "Add to Cart" action. Validates size and color,
   * then calls the `addToCart` function from the CartContext.
   */
  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Please select a size.");
      return;
    }
    if (!selectedColor) {
      toast.warn("Please select a color.");
      return;
    }
    addToCart(product._id, size, selectedColor, product);
    toast.info("Item added to cart!");
  };

  /**
   * Checks if a product is already in the wishlist.
   * @param {string} itemId - The ID of the product to check.
   * @returns {boolean} True if the item is in the wishlist, false otherwise.
   */
  const isItemInWishlist = (itemId) => {
    return (
      wishlistItems?.some(
        (wishlistItem) => wishlistItem?.product?._id === itemId
      ) || false
    );
  };

  /**
   * Toggles a product's presence in the wishlist.
   * @param {Event} e - The event object (e.g., click event).
   * @param {string} itemId - The ID of the product to add/remove from wishlist.
   */
  const handleLikeClick = async (e, itemId) => {
    e.preventDefault();
    if (!wishlistItems) {
      toast.error("Wishlist is not available. Please log in.");
      return;
    }

    try {
      if (isItemInWishlist(itemId)) {
        await removeFromWishlist(itemId);
        toast.success("Item removed from wishlist.");
      } else {
        await addToWishlist(itemId);
        toast.success("Item added to wishlist!");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Please log in to add items to your wishlist.");
    }
  };

  // --- Effects ---

  // Effect to fetch product data when productId changes
  useEffect(() => {
    fetchProductData();
  }, [productId]); // Dependency array includes productId to re-fetch on product change

  // Effect to initialize `allImages` array and `currentImageIndex` when product or main image changes
  useEffect(() => {
    if (product.image) {
      const images = [...(colorImages || [])];
      setAllImages(images);

      // Find the index of the currently displayed image
      const currentIndex = images.findIndex((img) => img === image);
      if (currentIndex !== -1) {
        setCurrentImageIndex(currentIndex);
      }
    }
  }, [product, image]); // Depend on product and current image

  // --- Image Gallery Navigation Functions ---

  /** Moves to the next image in the `allImages` array. */
  const goToNextImage = () => {
    if (allImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % allImages.length;
      setCurrentImageIndex(nextIndex);
      setImage(allImages[nextIndex]);
    }
  };

  /** Moves to the previous image in the `allImages` array. */
  const goToPreviousImage = () => {
    if (allImages.length > 0) {
      const prevIndex =
        currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setImage(allImages[prevIndex]);
    }
  };

  /**
   * Sets the currently displayed image to a specific index.
   * @param {number} index - The index of the image to display.
   */
  const goToImage = (index) => {
    if (allImages.length > 0 && index >= 0 && index < allImages.length) {
      setCurrentImageIndex(index);
      setImage(allImages[index]);
    }
  };

  // --- Touch Swipe Handlers for Image Gallery ---

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === 0 || touchEndX.current === 0) return; // Prevent issues if touch wasn't fully recorded

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50; // Threshold for a left swipe
    const isRightSwipe = distance < -50; // Threshold for a right swipe

    if (isLeftSwipe) {
      goToNextImage();
    }
    if (isRightSwipe) {
      goToPreviousImage();
    }

    // Reset touch coordinates
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // --- Keyboard Navigation for Image Gallery (Arrow Keys) ---

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isImageModalOpen) {
        // Only handle key presses if modal is open
        if (e.key === "ArrowLeft") {
          goToPreviousImage();
        } else if (e.key === "ArrowRight") {
          goToNextImage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentImageIndex, allImages, isImageModalOpen]); // Depend on current image index, all images, and modal open state

  /**
   * Product Skeleton Loader Component
   * Displays a loading skeleton while product data is being fetched.
   */
  const ProductSkeleton = () => (
    <div className="border-t-2 pt-5 sm:pt-10 px-4 sm:px-10">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 sm:flex-row animate-pulse">
        {/* Small images (thumbnails) Skeleton */}
        <div className="hidden sm:flex sm:flex-col w-[10vw] gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-20 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Main image Skeleton */}
        <div className="w-full sm:w-[40%]">
          <div className="w-full aspect-square sm:h-[600px] bg-gray-200 rounded" />
        </div>

        {/* Product info Skeleton */}
        <div className="flex-1 mt-4 sm:mt-0">
          <div className="h-6 sm:h-8 w-full sm:w-2/3 bg-gray-200 rounded mb-4" />

          {/* Stars Skeleton */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
            ))}
            <div className="w-8 h-3 bg-gray-200 rounded ml-2" />
          </div>

          <div className="h-6 sm:h-8 w-20 bg-gray-200 rounded mt-4" />
          <div className="h-16 sm:h-20 w-full sm:w-4/5 bg-gray-200 rounded mt-4" />

          {/* Size buttons Skeleton */}
          <div className="flex gap-2 sm:gap-4 my-6 sm:my-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 sm:h-10 w-14 sm:w-16 bg-gray-200 rounded"
              />
            ))}
          </div>

          {/* Color buttons Skeleton */}
          <div className="flex gap-3 sm:gap-4 my-6 sm:my-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
            ))}
          </div>

          <div className="h-10 sm:h-12 w-32 bg-gray-200 rounded" />
          <hr className="mt-6 sm:mt-8 w-full sm:w-4/5" />

          {/* Product features Skeleton */}
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

      {/* Description section Skeleton */}
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

  // Render the skeleton loader while data is loading
  if (isLoading) {
    return <ProductSkeleton />;
  }

  // --- Main Product Display ---
  return (
    <div className="border-t-2 pt-10 px-6 transition-opacity ease-in duration-500 opacity-100">
      {/* Breadcrumb Navigation */}
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

      {/* ---------------- Product Information and Images Section ----------------- */}
      <div className="flex-1  flex flex-col gap-2 md:flex-row">
        {/* Enhanced Image Gallery Section */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-[60vw] xl:w-[50vw] ">
          {
            loadingColorImages ? (
              <>
                <div className="hidden sm:flex sm:flex-col w-[10vw] gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-20 bg-gray-200 rounded" />
                  ))}
                </div>
                {/* Main image Skeleton */}
                <div className="w-full sm:w-[60%">
                  <div className="w-full aspect-square sm:h-[500px]  bg-gray-200 rounded" />
                </div>
              </>
            ) : (
              <>

                {/* Main Product Image with Navigation */}
                <div className="relative w-full md:w-[70%]   md:h-[50vh] lg:h-[90vh] overflow-hidden order-1 md:order-2 cursor-pointer group">
                  <img
                    className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity"
                    src={image}
                    alt={product?.name || "Product image"}
                    onClick={() => handleImageClick(image)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />

                  {/* Navigation Arrows for Main Image */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                        aria-label="Previous image"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={goToNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                        aria-label="Next image"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}

                  {/* Dot Indicators for Main Image */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50 hover:bg-opacity-75"
                            }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Images Section */}
                <div className="flex p-2 md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-y-auto md:h-[50vh] lg:h-[90vh] w-full md:w-[30%] pb-4 lg:pb-0 order-2 md:order-1">
                  {/* Additional image thumbnails */}
                  {colorImages.map((img, index) => (
                    <img
                      key={img || index} // Use image URL as key if unique, otherwise index
                      src={img}
                      onClick={() => {
                        setImage(img);
                        setCurrentImageIndex(index + 1); // +1 because main image is index 0
                        handleImageClick(img);
                      }}
                      loading="lazy"
                      alt={`Thumbnail ${index + 2} of product`}
                      className={`w-[80px] h-[90px] md:w-full md:h-auto object-cover flex-shrink-0 rounded-md cursor-pointer transition-all hover:opacity-80 ${currentImageIndex === index + 1
                        ? "ring-2 ring-orange-300"
                        : ""
                        }`}
                    />
                  ))}
                </div>


              </>
            )
          }


          {/* Image View Modal (full-screen image viewer) */}
          <ImageViewModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            images={allImages}
            currentImageIndex={currentImageIndex}
          />
        </div>
        <div className="flex items-start lg:w-[50vw] justify-between">
          {/* ---------------- Product Details and Actions ------------------ */}
          <div className="flex-1 sm:ml-5">
            <h1 className="font-medium text-2xl mt-2">{product?.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {renderStars(overAllReview[0])}
              <p className="pl-2">{product?.reviews?.length || 0}</p>
            </div>
            <div className="absolute end-5 flex flex-col lg:flex-row justify-center items-end gap-4">
              <LikeButton
                like={isItemInWishlist(product._id)}
                onLikeClick={(e) => handleLikeClick(e, product._id)}
              />
              <ShareButton product={product} />
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
              <p className="mt-1 text-green-600 font-semibold ">
                You save{" "}
                {Math.round(
                  (extraCharge / (product?.price + extraCharge)) * 100
                )}
                %!
              </p>
              <p className="mt-1 text-gray-500 text-xs">
                Inclusive of all Taxes
              </p>
            </div>

            {/* Size selection */}
            {/* Size Chart Modal Toggle (currently commented out but kept for future use) */}
            {product?.productCategory?.name && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-full bg-orange-300 text-xs text-black mt-2"
              >
                Size Chart
              </button>
            )}

            <p className="mt-2 mb-3 py-2 text-sm text-gray-500 italic">
              Please refer to size chart from images for accurate measurements
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-2 p-2 rounded-md">
              {product?.size?.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border bg-gray-100 py-2 px-4 rounded-md text-center ${item === size ? "ring-2 ring-orange-300 text-black" : ""
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Color selection using the reusable ColorSelector component */}
            <ColorSelector
              colors={product?.color || []}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
            <ToastContainer />

            <div className="space-y-4 mt-6">
              {/* Primary Action Buttons: Buy Now and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className="text-black w-full sm:w-auto px-8 py-3 text-sm active:bg-gray-700 bg-orange-300 rounded-md hover:bg-orange-400 transition-colors"
                >
                  BUY NOW
                </button>

                <button
                  onClick={handleAddToCart}
                  className="bg-black w-full sm:w-auto text-white px-8 py-3 text-sm active:bg-gray-700 rounded-md hover:bg-gray-800 transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            <hr className="mt-8 sm:w-4/5" />
            {/* Product features/details list */}
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              {product?.details?.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
          {/* Secondary Action Buttons: Like (Wishlist) and Share */}
        </div>
      </div>
      {/* Size Chart Modal - Rendered conditionally */}
      {isModalOpen && (
        <SizeChartModal
          setIsModalOpen={setIsModalOpen}
          parentCategory={product.productCategory.name}
        />
      )}

      {/* ------------------ Description, Additional Information & Reviews Sections --------------------*/}
      <div className="mt-10">
        {/* Section Navigation Tabs */}
        <div className="flex w-full sm:w-auto overflow-hidden">
          {/* Description Tab */}
          <p
            onClick={() => setSelectedBottomSection(bottomSection[0])}
            className={`w-full sm:w-auto border px-2 py-2 text-sm ${selectedBottomSection === bottomSection[0]
              ? "font-semibold"
              : "font-light"
              } cursor-pointer`}
          >
            Description
          </p>
          {/* Additional Information Tab */}
          <p
            onClick={() => setSelectedBottomSection(bottomSection[1])}
            className={`w-full sm:w-auto border px-2 py-2 text-sm ${selectedBottomSection === bottomSection[1]
              ? "font-semibold"
              : "font-light"
              } cursor-pointer`}
          >
            Additional Information
          </p>
          {/* Reviews Tab */}
          <div
            onClick={() => setSelectedBottomSection(bottomSection[2])}
            className={`sm:flex-row flex-col w-full inline-flex items-center justify-center cursor-pointer sm:w-auto border px-2 py-2`}
          >
            <p
              className={`px-2 text-sm ${selectedBottomSection === bottomSection[2]
                ? "font-semibold"
                : "font-light"
                }`}
            >
              Reviews
            </p>
            <div className="flex items-center">
              <img className="mr-2 h-4 w-4" src={assets.star_icon} alt="star" />{" "}
              {overAllReview[0]}
            </div>
          </div>
        </div>

        {/* Content Container for Selected Section */}
        <div className="w-full">
          {/* Description Content */}
          {selectedBottomSection === bottomSection[0] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 w-full">
              {product.description?.split(".").map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          )}

          {/* Additional Information Content */}
          {selectedBottomSection === bottomSection[1] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
              <p>{product.addInfo}</p>
            </div>
          )}

          {/* Reviews Content */}
          {selectedBottomSection === bottomSection[2] && (
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
              {product.reviews?.map((review, index) => (
                <ReviewBox key={index} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------------------ Related Products Section --------------------*/}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold mb-4">Related Products</h1>

        <div className="flex   overflow-x-auto space-x-4 scrollbar-hide scroll-smooth snap-x snap-mandatory px-1">
          {relatedProducts?.map((item) => (
            <div key={item._id} className="snap-start shrink-0 w-60">
              <ProductItem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                colors={item.color || []}
                like={isItemInWishlist(item._id)}
                onLikeClick={(e) => handleLikeClick(e, item._id)}
              // onClick={() => handleProductClick(item._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;

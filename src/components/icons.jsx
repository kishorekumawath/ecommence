export function IconButton({ iconPath, onClick, reduceIconSize = false }) {
  const iconSizeClass = reduceIconSize
    ? "h-2 w-2 md:h-3 md:w-3"
    : "h-3 w-3 md:h-5 md:w-5";

  return (
    <div
      onClick={onClick}
      className="bg-white backdrop-blur-md border border-white p-2 md:p-3 rounded-full transition-transform duration-300 transform hover:scale-125"
    >
      <img src={iconPath} alt="" className={iconSizeClass} />
    </div>
  );
}
import { FaHeart, FaRegHeart } from "react-icons/fa"; // for filled and outlined heart icons

export function LikeButton({ like, onLikeClick }) {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 border 
        ${like
          ? "bg-red-600 text-white hover:bg-pink-700 border-red-600"
          : "bg-white text-red-600 hover:bg-pink-100 border-red-600"
        }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onLikeClick(e);
      }}
      aria-label={like ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {like ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
    </button>
  );
}

import { toast } from "react-toastify";

export function ShareButton({ product }) {
  const handleShare = async () => {
    const shareText = `Check out this product: ${product?.name || "Product"}\n\n${product?.description || ""}\n\n${window.location.href}`;

    try {
      if (navigator.share) {
        // Try sharing via Web Share API
        await navigator.share({
          title: product?.name || "Check this out",
          text: shareText,
          url: window.location.href,
        });
        return;
      }

      // Fallback to Clipboard
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.success("Product details copied to clipboard!");
        return;
      }

      // Fallback for very old browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast.success("Product details copied to clipboard!");
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Unable to share. Please copy the link manually.");
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleShare();
      }}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
      title="Share this product"
      aria-label="Share this product"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
        />
      </svg>
    </button>
  );
}
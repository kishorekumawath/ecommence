export function IconButton({ iconPath, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-2 md:p-3 rounded-full transition-transform duration-300 transform hover:scale-125"
    >
      <img src={iconPath} alt="" className="h-3 w-3 md:h-5 md:w-5 " />
    </div>
  );
}

export function LikeButton({ like, onLikeClick }) {
  return (
    <div>
      <button
        className={`px-4 py-2 rounded-full transition-colors duration-300 text-white font-medium ${
          like
            ? "bg-pink-600 hover:bg-pink-700"
            : "bg-gray-300 hover:bg-gray-400 text-gray-800"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLikeClick(e);
        }}
      >
        {like ? "♥ In Wishlist" : "♡ Add to Wishlist"}
      </button>
    </div>
  );
}

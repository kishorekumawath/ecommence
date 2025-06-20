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
        className={`px-8 py-3 text-sm w-full sm:w-auto rounded-md transition-colors duration-300 text-orange-300 font-medium ${
          like
            ? "bg-pink-600 hover:bg-pink-700 text-white"
            : "bg-white border border-pink-700 hover:bg-pink-600 hover:text-white"
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

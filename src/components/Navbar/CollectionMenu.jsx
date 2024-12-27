import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";
import { useCollections } from "../../context/CollectionsContext";

function CollectionMenu() {
  const [selectedCollection, setSelectedCollection] = useState("Newly Added");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { CollectionsData, isLoading, error, fetchCollections } = useCollections();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Skeleton loader for collection items
  const SkeletonItem = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  // Skeleton loader for categories
  const SkeletonCategory = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mx-5 my-2"></div>
    </div>
  );

  const MenuContent = () => {
    const isDataAvailable = !isLoading && !error && CollectionsData && Object.keys(CollectionsData).length > 0;
    const collections = isDataAvailable ? Object.keys(CollectionsData) : [];
    const subcategories = isDataAvailable && CollectionsData[selectedCollection] ? CollectionsData[selectedCollection] : [];

    return (
      <div className="flex max-h-[inherit] h-full pt-2">
        {/* Left Sidebar */}
        <div className="border-r border-gray-200 w-1/2">
          <ul className="space-y-4">
            {!isDataAvailable ? (
              Array(6).fill(0).map((_, index) => (
                <SkeletonCategory key={index} />
              ))
            ) : (
              collections.map((collection) => (
                <li
                  key={collection}
                  onClick={() => setSelectedCollection(collection)}
                  className={`font-medium hover:text-black px-5 py-2 ${
                    selectedCollection === collection
                      ? "text-black bg-orange-200"
                      : "text-gray-500"
                  } cursor-pointer`}
                >
                  {collection}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Right Content */}
        <div className="px-5 w-full pb-5 overflow-y-auto">
          <h1 className="text-xl font-semibold mb-4 mt-2">
            {selectedCollection}
          </h1>
          <div className="grid grid-cols-2 gap-8 text-gray-500 items-center">
            {!isDataAvailable || subcategories.length === 0 ? (
              Array(6).fill(0).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            ) : (
              subcategories.map((subcategory, index) => (
                <Link to="/collection" key={index}>
                  <div className="hover:bg-gray-100 bg-gray-50 rounded-lg">
                    <img
                      src={
                        subcategory.thumbnail ??
                        "https://www.shutterstock.com/image-photo/young-man-wearing-winter-clothes-260nw-1022031901.jpg"
                      }
                      alt={subcategory.name}
                      className="rounded-lg"
                    />
                    <p className="text-gray-600 hover:text-black line-clamp-2 text-xs">
                      {subcategory.name}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <MenuItem name={"COLLECTIONS"} />
      </div>

      <div
        className={`absolute z-10 w-1/2 max-h-[60vh] border bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <MenuContent />
      </div>
    </div>
  );
}

export default CollectionMenu;

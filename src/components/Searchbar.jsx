import React from "react";
import { assets } from "../assets/assets";

export const Searchbar = ({
  searchQuery,
  setSearchQuery,
  filteredProducts,
}) => {
  console.log(filteredProducts);
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[30%] p-2 border border-gray-300 rounded-md pl-8"
        />
        <img
          src={assets.search_icon}
          alt="search"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4"
        />
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-500 mt-2">
          Found {filteredProducts.length} results
        </p>
      )}
    </div>
  );
};

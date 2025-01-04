import React from "react";
import { assets } from "../assets/assets";

export const Searchbar = ({
  searchQuery,
  setSearchQuery,
  filteredProducts,
}) => {

  return (
    <div className="">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-full md:w-auto border border-gray-300 hover:border-gray-500 rounded-full  pr-10 pl-5 bg-gray-50"
        />
        <img
          src={assets.search_icon}
          alt="search"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 cursor-pointer hover:scale-125 transition-all duration-300"
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

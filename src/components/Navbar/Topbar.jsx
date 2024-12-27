import React from "react";
import { NavLink } from "react-router-dom";
import MenuItem from "./MenuItem";
import CollectionMenu from "./CollectionMenu";
function Topbar({ CollectionsData, isLoading }) {
  //   console.log("CollectionsData:Topbar page", CollectionsData, isLoading);
  return (
    <div>
      <ul className=" sm:flex gap-5 text-sm text-gray-700 hidden">
        <NavLink to="/">
          <MenuItem name={"HOME"} />
        </NavLink>
        <CollectionMenu
          CollectionsData={CollectionsData}
          isLoading={isLoading}
        />
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <MenuItem name={"ABOUT"} />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <MenuItem name={"CONTACT"} />
        </NavLink>

        <div className="group relative">
          <div className="flex flex-col items-center gap-1 group">
            <p className="cursor-pointer ">PAGES</p>
            <hr
              className={`w-2/4 border-none h-[3px] bg-orange-300 group-hover:block hidden rounded`}
            />
          </div>

          <div className="absolute z-10 w-56 bg-white  rounded-md shadow-lg group-hover:block hidden">
            <div className="py-1">
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
              >
                My Profile
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
              >
                Orders
              </a>
              <a
                href="#"
                className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
              >
                Wishlist
              </a>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default Topbar;

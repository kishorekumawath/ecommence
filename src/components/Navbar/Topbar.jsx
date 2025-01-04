import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import CollectionMenu from "./CollectionMenu";
import { useAuth } from "../../context/AuthContext";


function Topbar() {
  const navigate = useNavigate();
  const {user,} = useAuth();
  const openProfile = () => {
   navigate("/profile") 
  }
  return (
    <div>
      <ul className=" sm:flex gap-5 text-sm text-gray-700 hidden">
        <NavLink to="/">
          <MenuItem name={"HOME"} />
        </NavLink>
        {/*  CollectionMenu component */}
        <CollectionMenu />
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
              {
                user ? (
                  <div
                    onClick={openProfile}
                    className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
                  >
                    My Profile
                  </div>
                ) : (
                  <Link
                    to="/signup"
                    className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
                  >
                    Sign Up
                  </Link>
                )
              }
              {/* <div
                onClick={openProfile}
                className={`block px-4 py-2 text-sm text-gray-500 hover:bg-orange-50 hover:text-gray-900`}
              >
                My Profile
              </div> */}
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

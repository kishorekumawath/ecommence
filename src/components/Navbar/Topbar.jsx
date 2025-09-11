import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import CollectionMenu from "./CollectionMenu";

function Topbar() {
  return (
    <div>
      <ul className=" sm:flex gap-5 text-sm text-gray-700 hidden">
        <NavLink to="/">
          <MenuItem name={"HOME"} />
        </NavLink>
        {/*  CollectionMenu component */}
        {/* <CollectionMenu /> */}
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <MenuItem name={"ABOUT"} />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <MenuItem name={"CONTACT"} />
        </NavLink>
      </ul>
    </div>
  );
}

export default Topbar;

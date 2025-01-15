import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <div className="m-5 pt-10 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 text-sm">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Your go-to destination for trendy t-shirts and streetwear designed
            for comfort, affordability, and self-expression. From classic fits
            to oversized and acid-washed styles, we bring unique designs
            inspired by anime, Marvel, DC, and urban culture. Starting at just
            ₹800, Moonsflare is where fashion meets individuality.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to="/">Home</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About Us</Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MORT INFO</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Condition</Link>
            <Link to="/return">Refund Policy</Link>
            <Link to="/shipping">Shipping Policy</Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 7569795229</li>
            <li>support@moonsflare.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className=" py-5 text-sm text-center">
          {" "}
          © 2025 moonsflare.com - All Right Reserved.{" "}
        </p>
      </div>
    </div>
  );
}

export default Footer;

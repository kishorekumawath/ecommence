import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

function Footer() {
  return (
    <div>
      <div className="m-5 pt-10 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 text-sm">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600 text-justify">
            Your go-to destination for trendy t-shirts and streetwear designed
            for comfort, affordability, and self-expression. From classic fits
            to oversized and acid-washed styles, we bring unique designs
            inspired by anime, Marvel, DC, and urban culture, Moonsflare is
            where fashion meets individuality.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link
              to="/"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              About Us
            </Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MORE INFO</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link
              to="/privacy"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Terms & Condition
            </Link>
            <Link
              to="/return"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Refund Policy
            </Link>
            <Link
              to="/shipping"
              className="hover:text-gray-800 transition-colors duration-300"
            >
              Shipping Policy
            </Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li>+91 7569795229</li>
            <li>contact@moonsflare.com</li>
            <li className="pt-2">Follow Us</li>
            <li className="flex gap-4">
              <a
                href="https://instagram.com/moonsflaredotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-300 flex items-center gap-2"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
              <a
                href="https://facebook.com/moonsflaredotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center gap-2"
              >
                <Facebook size={20} />
                <span>Facebook</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-600">
          © 2025 moonsflare.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;

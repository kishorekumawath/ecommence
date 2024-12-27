import React from "react";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div>
      <div className="m-5 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 text-sm">
        <div>
          <img src={assets.logo} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
            assumenda ea perspiciatis voluptatem quae vel illo nesciunt officia
            id, obcaecati veniam vero nihil corporis a recusandae quia iure ab
            eligendi?
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Shop</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">MORT INFO</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms & Condition</li>
            <li>Refund Policy</li>
            <li>Shipping Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91 1112223334</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className=" py-5 text-sm text-center">
          {" "}
          Copyrightt 2024@ kishore.com - All Right Reserved.{" "}
        </p>
      </div>
    </div>
  );
}

export default Footer;

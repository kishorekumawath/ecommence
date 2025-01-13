import React, { useEffect, useState } from "react";
import { Title } from "./Title";

function CartTotal({ total,}) {
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={" TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>SubTotal</p>
          <p>{`₹ ${total}`}</p>
        </div>

  
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>{`₹ ${total}`}</b>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;

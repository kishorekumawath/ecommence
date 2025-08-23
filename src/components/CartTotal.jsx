import React from "react";
import { Title } from "./Title";

function CartTotal({ total,originalAmount=0, totalNoOfItems, shippingCost = 0, taxRate = 0 }) {
  // Calculate the total discount amount
  const totalDiscount =  originalAmount - total;

  // Calculate the original price (before discount)
  const originalPrice = total;

  // Calculate the discount percentage
  const discountPercentage =
    originalPrice > 0 ? Math.round((totalDiscount / originalAmount) * 100) : 0;

  // Calculate tax amount
  const taxAmount = total * (taxRate / 100);

  // Calculate the final total
  const finalTotal = total + shippingCost + taxAmount;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="w-full ">
      <div className="text-2xl mb-4">
        <Title text1={"CART"} text2={" TOTALS"} />
      </div>
      <div className="flex flex-col gap-3 text-sm">

        {totalDiscount > 0 && (
          <div className="flex justify-between">
            <p className="font-medium">Original Price</p>
            <p className="line-through text-gray-500">{formatCurrency(originalAmount)}</p>
          </div>
        )}


        {totalDiscount > 0 && (
          <div className="flex justify-between">
            <p className="font-medium">
              Discount{" "}
              <span className="text-green-600 text-xs">
                ({discountPercentage}%)
              </span>
            </p>
            <p className="text-green-600">-{formatCurrency(totalDiscount)}</p>
          </div>
        )}

        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p>{formatCurrency(total)}</p>
        </div>



        {/* 
        <div className="flex justify-between">
          <p className="font-medium">Shipping</p>
          <p>{formatCurrency(shippingCost)}</p>
        </div>

        <div className="flex justify-between">
          <p className="font-medium">Tax</p>
          <p>{formatCurrency(taxAmount)}</p>
        </div> */}

        <hr className="my-2" />
        <div className="flex justify-between text-lg font-bold">
          <p>Total</p>
          <p>{formatCurrency(finalTotal)}</p>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;

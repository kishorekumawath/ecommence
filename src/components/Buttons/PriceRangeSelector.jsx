import React from "react";

const PriceRangeSelector = ({ ranges = [], selectedRange, onSelect }) => {
  const handleSelect = (range) => {
    if (range === selectedRange) {
      onSelect(null); // deselect if already selected
    } else {
      onSelect(range); // select new range
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {ranges.map((range, index) => (
        <button
          key={index}
          onClick={() => handleSelect(range)}
          className={`border bg-gray-100 py-2 px-4 rounded-md text-center text-sm ${
            range === selectedRange
              ? "ring-2 ring-orange-300 text-black font-bold"
              : "font-light"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
};

export default PriceRangeSelector;
import React, { useState } from "react";

export const SizeChartModal = ({ setIsModalOpen }) => {
  const [unit, setUnit] = useState("Inches");

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  // Size data in Inches
  const sizeDataInInches = [
    {
      size: "S",
      chest: 40,
      toFitChest: 38,
      shoulder: 16.75,
      length: 26,
      waist: 42,
    },
    {
      size: "M",
      chest: 42,
      toFitChest: 40,
      shoulder: 17.5,
      length: 27,
      waist: 44,
    },
    {
      size: "L",
      chest: 44,
      toFitChest: 42,
      shoulder: 18.25,
      length: 28,
      waist: 46,
    },
    {
      size: "XL",
      chest: 46,
      toFitChest: 44,
      shoulder: 19,
      length: 28.5,
      waist: 48,
    },
    {
      size: "XXL",
      chest: 48,
      toFitChest: 46,
      shoulder: 19.75,
      length: 29,
      waist: 50,
    },
    {
      size: "XXXL",
      chest: 50,
      toFitChest: 48,
      shoulder: 20.5,
      length: 29.5,
      waist: 52,
    },
  ];

  // Conversion function
  const convertToCms = (value) => (value * 2.54).toFixed(2);

  // Adjusted size data based on the selected unit
  const sizeData =
    unit === "Cms"
      ? sizeDataInInches.map((row) => ({
          size: row.size,
          chest: convertToCms(row.chest),
          toFitChest: convertToCms(row.toFitChest),
          shoulder: convertToCms(row.shoulder),
          length: convertToCms(row.length),
          waist: convertToCms(row.waist),
        }))
      : sizeDataInInches;

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left overflow-x-auto">
                  <h3
                    className="text-base font-semibold text-gray-900 mb-2"
                    id="modal-title"
                  >
                    Size Chart
                  </h3>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => handleUnitChange("Inches")}
                      className={`px-4 py-1 border ${
                        unit === "Inches"
                          ? "bg-orange-300 text-white"
                          : "bg-gray-100 text-gray-600"
                      } rounded-l-md`}
                    >
                      Inches
                    </button>
                    <button
                      onClick={() => handleUnitChange("Cms")}
                      className={`px-4 py-1 border ${
                        unit === "Cms"
                          ? "bg-orange-300 text-white"
                          : "bg-gray-100 text-gray-600"
                      } rounded-r-md`}
                    >
                      Cms
                    </button>
                  </div>
                  <table className="table w-full text-sm text-gray-700 border-collapse  ">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Size</th>
                        <th className="border p-2">Chest</th>
                        <th className="border p-2">To Fit Chest</th>
                        <th className="border p-2">Shoulder</th>
                        <th className="border p-2">Length</th>
                        <th className="border p-2">Waist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeData.map((row, index) => (
                        <tr key={index} className="text-center">
                          <td className="border p-2">{row.size}</td>
                          <td className="border p-2">{row.chest}</td>
                          <td className="border p-2">{row.toFitChest}</td>
                          <td className="border p-2">{row.shoulder}</td>
                          <td className="border p-2">{row.length}</td>
                          <td className="border p-2">{row.waist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

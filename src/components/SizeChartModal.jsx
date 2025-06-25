import React, { useState } from "react";

export const SizeChartModal = ({ setIsModalOpen, parentCategory }) => {
  const [unit, setUnit] = useState("Inches");

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  // Size data in Inches
  const sizeDatabase = {
    // Men's Categories
    "Acid Wash Oversized T-shirt": [
      { size: "XS", chest: 39, length: 27 },
      { size: "S", chest: 41, length: 28 },
      { size: "M", chest: 43, length: 29 },
      { size: "L", chest: 45, length: 30 },
      { size: "XL", chest: 47, length: 31 },
      { size: "XXL", chest: 49, length: 32 },
    ],
    "Acid Wash Hoodie": [
      { size: "XS", chest: 38, length: 25 },
      { size: "S", chest: 40, length: 26 },
      { size: "M", chest: 42, length: 27 },
      { size: "L", chest: 44, length: 28 },
      { size: "XL", chest: 46, length: 29 },
      { size: "XXL", chest: 48, length: 30 },
    ],
    "Oversized T-shirt": [
      { size: "XS", chest: 39, length: 27 },
      { size: "S", chest: 41, length: 28 },
      { size: "M", chest: 43, length: 29 },
      { size: "L", chest: 45, length: 30 },
      { size: "XL", chest: 47, length: 31 },
      { size: "XXL", chest: 49, length: 32 },
    ],
    "Crop Top": [
      { size: "XS", chest: 32, length: 15.5 },
      { size: "S", chest: 34, length: 16.5 },
      { size: "M", chest: 36, length: 17.5 },
      { size: "L", chest: 38, length: 18.5 },
      { size: "XL", chest: 40, length: 19.5 },
      { size: "XXL", chest: 42, length: 20.5 },
    ],
    "Terry Oversized T-shirt": [
      { size: "XS", chest: 39, length: 26, shoulder: 18, sleeveOpen: 6.5, sleeveLength: 7.5 },
      { size: "S", chest: 41, length: 27, shoulder: 19, sleeveOpen: 7, sleeveLength: 8.5 },
      { size: "M", chest: 43, length: 28, shoulder: 20, sleeveOpen: 7.5, sleeveLength: 9.5 },
      { size: "L", chest: 45, length: 29, shoulder: 21, sleeveOpen: 8, sleeveLength: 10.5 },
      { size: "XL", chest: 47, length: 30, shoulder: 22, sleeveOpen: 8.5, sleeveLength: 11.5 },
      { size: "XXL", chest: 49, length: 31, shoulder: 23, sleeveOpen: 9, sleeveLength: 12.5 },
    ],
    "Hooded Sweatshirt": [
      { size: "XS", chest: 38, length: 25 },
      { size: "S", chest: 40, length: 26 },
      { size: "M", chest: 42, length: 27 },
      { size: "L", chest: 44, length: 28 },
      { size: "XL", chest: 46, length: 29 },
      { size: "XXL", chest: 48, length: 30 },
    ],
    "Crop Hoodie": [
      { size: "XS", chest: 32, length: 16, shoulder: 16.75 },
      { size: "S", chest: 34, length: 16.5, shoulder: 17.75 },
      { size: "M", chest: 36, length: 17, shoulder: 18.75 },
      { size: "L", chest: 38, length: 17.5, shoulder: 19.75 },
      { size: "XL", chest: 40, length: 18, shoulder: 20.75 },
      { size: "XXL", chest: 42, length: 18.5, shoulder: 21.75 },
    ],
    "Zip Hoodie": [
      { size: "S", chest: 40, length: 26 },
      { size: "M", chest: 42, length: 27 },
      { size: "L", chest: 44, length: 28 },
      { size: "XL", chest: 46, length: 29 },
      { size: "XXL", chest: 48, length: 30 },
    ],
    "Oversized Hooded Sweatshirt": [
      { size: "S", chest: 40, length: 27 },
      { size: "M", chest: 42, length: 28 },
      { size: "L", chest: 44, length: 29 },
      { size: "XL", chest: 46, length: 30 },
      { size: "XXL", chest: 48, length: 31 },
    ],
    "Sweatshirt": [
      { size: "XS", chest: 38, length: 25 },
      { size: "S", chest: 40, length: 26 },
      { size: "M", chest: 42, length: 27 },
      { size: "L", chest: 44, length: 28 },
      { size: "XL", chest: 46, length: 29 },
      { size: "XXL", chest: 48, length: 30 },
    ],
    "Oversized Sweatshirt": [
      { size: "S", chest: 40, length: 27 },
      { size: "M", chest: 42, length: 28 },
      { size: "L", chest: 44, length: 29 },
      { size: "XL", chest: 46, length: 30 },
      { size: "XXL", chest: 48, length: 31 },
    ],
    "Women's Classic T-shirt": [
      { size: "S", chest: 32, length: 23 },
      { size: "M", chest: 34, length: 24 },
      { size: "L", chest: 36, length: 25 },
      { size: "XL", chest: 38, length: 26 },
      { size: "XXL", chest: 40, length: 27 },
    ],
    "Varsity Jacket": [
      { size: "XS", chest: 38, length: 25, shoulder: 17, sleeveLength: 21.5 },
      { size: "S", chest: 40, length: 26, shoulder: 18, sleeveLength: 22.5 },
      { size: "M", chest: 42, length: 27, shoulder: 19, sleeveLength: 23.5 },
      { size: "L", chest: 44, length: 28, shoulder: 20, sleeveLength: 24.5 },
      { size: "XL", chest: 46, length: 29, shoulder: 21, sleeveLength: 25.5 },
      { size: "XXL", chest: 48, length: 30, shoulder: 22, sleeveLength: 26.5 },
    ],
  };

  // Get size data for the specific parent category
  const sizeDataInInches = sizeDatabase[parentCategory] || [];

  // Conversion function
  const convertToCms = (value) => (value * 2.54).toFixed(2);

  // Convert data to cms if needed
  const convertRowToCms = (row) => {
    const convertedRow = { size: row.size };
    Object.keys(row).forEach(key => {
      if (key !== 'size') {
        convertedRow[key] = convertToCms(row[key]);
      }
    });
    return convertedRow;
  };

  // Adjusted size data based on the selected unit
  const sizeData = unit === "Cms" 
    ? sizeDataInInches.map(convertRowToCms)
    : sizeDataInInches;

  // Get all possible columns from the data
  const getColumns = () => {
    if (sizeData.length === 0) return [];
    const firstRow = sizeData[0];
    return Object.keys(firstRow);
  };

  const columns = getColumns();

  // Format column headers
  const formatHeader = (key) => {
    switch (key) {
      case 'size': return 'Size';
      case 'chest': return 'Chest';
      case 'length': return 'Length';
      case 'shoulder': return 'Shoulder';
      case 'sleeveOpen': return 'Sleeve Open';
      case 'sleeveLength': return 'Sleeve Length';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  // Show message if no data found for the category
  if (!sizeDataInInches.length) {
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
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold text-gray-900 mb-2"
                      id="modal-title"
                    >
                      Size Chart
                    </h3>
                    <p className="text-gray-600">
                      Size chart not available for "{parentCategory}"
                    </p>
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
  }

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
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3
                    className="text-base font-semibold text-gray-900 mb-2"
                    id="modal-title"
                  >
                    Size Chart - {parentCategory}
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
                  <div className="overflow-x-auto">
                    <table className="table w-full text-sm text-gray-700 border-collapse min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          {columns.map((column) => (
                            <th key={column} className="border p-2 text-center">
                              {formatHeader(column)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeData.map((row, index) => (
                          <tr key={index} className="text-center">
                            {columns.map((column) => (
                              <td key={column} className="border p-2">
                                {row[column] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
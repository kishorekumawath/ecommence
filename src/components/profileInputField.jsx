import React from "react";

function ProfileInputField({
  isDisable,
  title,
  name,
  value,
  handleInputChange,
}) {
  return (
    <div className="flex-1 flex-col justify-center ">
      <p className="block text-xs font-medium text-gray-400 mb-1 ">{title}</p>
      <input
        type="text"
        name={name}
        value={value}
        disabled={!isDisable}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}

export default ProfileInputField;

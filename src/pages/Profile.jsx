import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Orders from "./Orders";
import { Title } from "../components/Title";
import { Pencil, PencilOff } from "lucide-react";
import ProfileInputField from "../components/profileInputField";

const Profile = () => {
  const { user, loading, error, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
    country: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
    doorNo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        country: user.address?.country || "",
        state: user.address?.state || "",
        city: user.address?.city || "",
        street: user.address?.street || "",
        pincode: user.address?.pincode || "",
        doorNo: user.address?.doorNo || "",
      });
    }
  }, [user]);
  console.log(formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your update profile logic here
    try {
      updateUser(formData);
      // setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      // setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      //   setMessage({
      //     text: "Failed to update profile. Please try again.",
      //     type: "error",
      //   });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col  gap-5 px-5">
      <div className="flex-1 bg-white shadow rounded-lg p-6 mb-5 sm:m-0 border border-gray-100">
        {/* Profile Header */}
        <div className="flex justify-between items-center text-2xl mb-6">
          <Title text1={"MY"} text2={"  PROFILE"} />

          <div
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-full bg-orange-300 p-3"
          >
            {!isEditing ? (
              <Pencil className="text-black" size={15} />
            ) : (
              <PencilOff className="text-black" size={15} />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            {/* <div className="relative"> */}
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
              />
            </div>
            <div className="flex flex-col-reverse md:flex-col w-full gap-2">
              <div className="flex gap-5 justify-center items-center  w-full">
                <ProfileInputField
                  isDisable={isEditing}
                  title={"First Name"}
                  name={"firstName"}
                  value={formData.firstName}
                  handleInputChange={handleInputChange}
                />
                <ProfileInputField
                  isDisable={isEditing}
                  title={"Last Name"}
                  name={"lastName"}
                  value={formData.lastName}
                  handleInputChange={handleInputChange}
                />
              </div>
              {isEditing && (
                <ProfileInputField
                  isDisable={isEditing}
                  title={"Avatar URL"}
                  name={"avatar"}
                  value={formData.avatar}
                  handleInputChange={handleInputChange}
                />
              )}
            </div>

            {/* {isEditing && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="Enter avatar URL"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )} */}
            {/* </div> */}
          </div>
          <ProfileInputField
            isDisable={false}
            title={"Email"}
            name={"email"}
            value={formData.email}
            handleInputChange={() => {}}
          />
          <ProfileInputField
            isDisable={false}
            title={"Phone Number"}
            name={"phone"}
            value={formData.phone}
            handleInputChange={() => {}}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInputField
              isDisable={isEditing}
              title={"Country"}
              name={"country"}
              value={formData.country}
              handleInputChange={handleInputChange}
            />
            <ProfileInputField
              isDisable={isEditing}
              title={"State"}
              name={"state"}
              value={formData.state}
              handleInputChange={handleInputChange}
            />
            <ProfileInputField
              isDisable={isEditing}
              title={"City"}
              name={"city"}
              value={formData.city}
              handleInputChange={handleInputChange}
            />
            <ProfileInputField
              isDisable={isEditing}
              title={"Street"}
              name={"street"}
              value={formData.street}
              handleInputChange={handleInputChange}
            />
            <ProfileInputField
              isDisable={isEditing}
              title={"Zip Code"}
              name={"pincode"}
              value={formData.pincode}
              handleInputChange={handleInputChange}
            />
            <ProfileInputField
              isDisable={isEditing}
              title={"Door No."}
              name={"doorNo"}
              value={formData.doorNo}
              handleInputChange={handleInputChange}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-300 text-black rounded hover:bg-orange-400 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="flex-1 border border-gray-100 shadow-md rounded-md h-[60vh] overflow-y-scroll">
        <Orders />
      </div>
    </div>
  );
};

export default Profile;

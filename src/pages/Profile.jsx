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
    address: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const updateProfilePic = ()=>{
    alert("I am an alert box!");
  }
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

          <div onClick={() => setIsEditing(!isEditing)} className="rounded-full bg-orange-300 p-3">
            {isEditing ?
              <Pencil className="text-black" size={15} /> :
              <PencilOff className="text-black" size={15} />
            }
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex gap-2 mb-6">
            {/* <div className="relative"> */}
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
              />
              {
                isEditing && (
                  <div>
                    <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                    <div onClick={updateProfilePic} className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-orange-300 p-2 rounded-full">
                      <Pencil className=" text-black  " size={15} />
                    </div></div>
                )
              }

            </div>

            <div className="flex gap-5 justify-center items-center">

              <ProfileInputField isDisable={isEditing} title={"First Name"} value={formData.firstName} handleInputChange={handleInputChange} />
              <ProfileInputField isDisable={isEditing} title={"Last Name"} value={formData.lastName} handleInputChange={handleInputChange} />

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
          <ProfileInputField isDisable={false} title={"Email"} value={formData.email} handleInputChange={() => { }} />
          <ProfileInputField isDisable={false} title={"Phone Number"} value={formData.phone} handleInputChange={() => { }} />


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileInputField isDisable={isEditing} title={"Country"} value={"India"} handleInputChange={() => { }} />
            <ProfileInputField isDisable={isEditing} title={"State"} value={"AP"} handleInputChange={() => { }} />
            <ProfileInputField isDisable={isEditing} title={"City"} value={"Tirupati"} handleInputChange={() => { }} />
            <ProfileInputField isDisable={isEditing} title={"Street"} value={"Balaji Colony"} handleInputChange={() => { }} />
            <ProfileInputField isDisable={isEditing} title={"Zip Code"} value={"517501"} handleInputChange={() => { }} />
            <ProfileInputField isDisable={isEditing} title={"Door No."} value={"4-11/3"} handleInputChange={() => { }} />
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

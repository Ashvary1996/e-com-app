import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(location);

  const user = location.state.userData || {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const userID = user._id;

  // console.log("userForEDit", user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(formData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const linkbyRole =
        user.role == "admin" ? "updateProfileByAdmin" : "updateProfile";

      const res = await axios.put(`http://localhost:5000/user/${linkbyRole}`, {
        // const res = await axios.put(
        //   `http://localhost:5000/user/updateProfileByAdmin`,  {
        userID,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: user.role,
      });
      if (res.data.success == true) {
        toast.success("Profile Updated Successfully");
        setTimeout(() => {
          navigate(-1);
        }, 3333);
      }
      console.log(res.data);
    } catch (error) {
      console.error(`Error updating user details:`, error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
            className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

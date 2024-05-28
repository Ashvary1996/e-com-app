import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AllMembers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleEdit = (id, user) => {
    // Implement edit functionality
    navigate("/user/admin/editProfile", { state: { userData: user } });
    console.log(`Edit user with id: ${id}`);
  };
  const handleDelete = async (id, user) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${user.firstName}?`
    );

    if (isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_HOST_URL}/user/admin/deleteUser/${id}`
        );
        toast.success(`User ${user.firstName} deleted`);
        setUsers(users.filter((existingUser) => existingUser._id !== id));
      } catch (error) {
        toast.error(`Error deleting user ${user.firstName}: ${error.message}`);
        console.error(`Error deleting user with id: ${id}`, error);
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    console.log(id, newRole);
    // Implement role change functionality
    try {
      await axios.put(
        `${process.env.REACT_APP_HOST_URL}/user/admin/getSingleUser`,
        {
          findUserId: id,
          updateRole: newRole,
        }
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error(`Error updating role for user with id: ${id}`, error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/user/admin/getAllusers`
      );
      setUsers(res.data.inMoreDetail);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        List of All Registered Members
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left   text-xs font-medium text-gray-500 uppercase tracking-wider  ">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sign Up Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className=" p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 w-24"
                  >
                    <option value={user.role}>{user.role}</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <div className="absolute top-full left-0 -mt-2 bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    {user.role}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.sign_up_Date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(user._id, user)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllMembers;

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
  /* eslint-disable no-restricted-globals */
  const handleDelete = async (id, user) => {
    const isConfirmed = confirm(
      `Are you sure you want to delete ${user.firstName}?`
    );

    if (isConfirmed) {
      try {
       
        await axios.delete(`${process.env.REACT_APP_HOST_URL}/user/admin/deleteUser/${id}`);
        toast.success(`User ${user.firstName} deleted`);
        setUsers(users.filter((existingUser) => existingUser._id !== id));
      } catch (error) {
        toast.error(`Error deleting user ${user.firstName}: ${error.message}`);
        console.error(`Error deleting user with id: ${id}`, error);
      }
    }
  };
  /* eslint-enable no-restricted-globals */
  const handleRoleChange = async (id, newRole) => {
    console.log(id, newRole);
    // Implement role change functionality
    try {
      await axios.put(`http://localhost:5000/user/admin/getSingleUser`, {
        findUserId: id,
        updateRole: newRole,
      });
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
    <div className="container">
      <h1>List of All Registered Members</h1>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Sign Up Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>
                  <img
                    src={user.avatar.url}
                    alt="Avatar"
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value={user.role}>{user.role}</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td>{new Date(user.sign_up_Date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(user._id, user)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id, user)}
                    className="btn btn-danger"
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

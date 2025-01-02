import React from "react";

const UserTable = ({ users = [], filteredUsers = [], onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {loading ? (
        <div className="text-center text-gray-600">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-600">No users found</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table */}
          <table className="min-w-full table-auto">
            {/* Table Header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Full Name</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Email</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Role</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Password</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Last Active</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2 text-gray-500">{user.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "Admin"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{user.password || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-500">{user.lastActive || "Unknown"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-md text-sm hover:bg-red-600 transition"
                      onClick={() => onDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;

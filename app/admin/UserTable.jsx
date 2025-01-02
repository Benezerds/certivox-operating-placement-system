import React from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
    return (
        <table className="w-full border border-gray-300 text-sm">
            <thead>
                <tr>
                    <th className="p-2 border-b">Name</th>
                    <th className="p-2 border-b">Email</th>
                    <th className="p-2 border-b">Role</th>
                    <th className="p-2 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="p-2 border-b">{user.name}</td>
                        <td className="p-2 border-b">{user.email}</td>
                        <td className="p-2 border-b">{user.role}</td>
                        <td className="p-2 border-b">
                            <button
                                className="text-blue-500 hover:underline mr-2"
                                onClick={() => onEdit(user)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => onDelete(user.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;

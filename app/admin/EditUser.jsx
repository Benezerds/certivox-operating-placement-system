import React, { useState, useEffect } from "react";

const EditUser = ({ user, onClose, onUpdateUser }) => {
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState(user.role || "");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !role) {
            alert("All fields are required!");
            return;
        }

        const updatedUser = {
            ...user,
            name,
            email,
            role,
        };

        // Notify parent component of the updated user
        onUpdateUser(updatedUser);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-lg">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit User</h2>

                {/* Edit User Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                    >
                        Update User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUser;

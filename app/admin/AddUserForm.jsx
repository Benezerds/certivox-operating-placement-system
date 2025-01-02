import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/firebase";

const AddUserForm = ({ onClose, onUserAdded }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState(""); // Added password state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add user to Firestore
            const newUser = { name, email, role, password, lastActive: "Just now" };
            await addDoc(collection(db, "Users"), newUser);

            // Notify parent component
            onUserAdded(newUser);
            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
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
            <div>
                <label className="block font-semibold">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg"
            >
                Add User
            </button>
        </form>
    );
};

export default AddUserForm;
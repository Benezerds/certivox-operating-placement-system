import React from "react";
import AddUserForm from "./AddUserForm";

const AddUser = ({ onClose, onUserAdded }) => {
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

                <h2 className="text-xl font-semibold mb-4">Add User</h2>

                {/* Add User Form */}
                <AddUserForm onClose={onClose} onUserAdded={onUserAdded} />
            </div>
        </div>
    );
};

export default AddUser;

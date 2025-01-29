import { auth } from "@/app/firebase";
import React, { useState } from "react";

const AddUserForm = ({ onClose, onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [errorMessage, setErrorMessage] = useState(null); // Error state
  const [showPassword, setShowPassword] = useState(false); // Show/Hide password

  const handleSubmit = async (e) => {
    console.log("Submitting Data...");
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
  
    // Validate required fields
    if (!name || !email || !role || !password) {
      alert("All fields are required!");
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Get the current user UID from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      const uid = currentUser.uid;
      console.log(uid);
  
      // Send data to backend via /api/users endpoint
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization-UID": uid, // Pass UID for permission check
        },
        body: JSON.stringify({ name, email, role, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add user");
      }
  
      const newUser = await response.json();
      onUserAdded(newUser); // Notify parent component
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
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
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="button"
            className="absolute text-sm text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}
      <button
        type="submit"
        className={`w-full bg-black text-white py-2 rounded-lg ${
          isSubmitting ? "opacity-50" : "hover:bg-gray-800"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add User"}
      </button>
    </form>
  );
};

export default AddUserForm;

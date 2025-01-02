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
      // Send data to backend via /api/users endpoint
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    console.log({ name, email, role, password });
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
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

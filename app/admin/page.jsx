"use client";

import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import CsvExport from "./CsvExport";
import UserTable from "./UserTable";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase"; // Adjust the path based on your project structure

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]); // Store users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [showAddUser, setShowAddUser] = useState(false); // Add User modal state
  const [showEditUser, setShowEditUser] = useState(false); // Edit User modal state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchUsers = () => {
    const usersCollection = collection(db, "Users");
  
    // Set up a real-time listener
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    });
  
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  };
  

  // Handle user search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  // Add new user
  const handleUserAdded = async (newUser) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const addedUser = await response.json();
        setUsers((prev) => [...prev, addedUser]);
        setFilteredUsers((prev) => [...prev, addedUser]);
        await fetchUsers();
      } else {
        console.error("Failed to add user:", await response.text());
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  // Update user
  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        const updated = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updated.id ? updated : user))
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updated.id ? updated : user))
        );
      } else {
        console.error("Failed to update user:", await response.text());
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      } else {
        console.error("Failed to delete user:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        router.push("/auth");
      } else {
        setIsAuthenticated(true);
  
        // Set up Firestore real-time listener for users
        const unsubscribeFirestore = onSnapshot(collection(db, "Users"), (snapshot) => {
          const userList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(userList);
          setFilteredUsers(userList);
        });
  
        // Cleanup Firestore listener when component unmounts
        return () => unsubscribeFirestore();
      }
    });
  
    // Cleanup Auth listener when component unmounts
    return () => unsubscribeAuth();
  }, [router]);
  

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Search, Export, Add User */}
      <div className="flex justify-between items-center px-8 py-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users"
          className="border border-gray-300 px-4 py-2 rounded-lg w-1/2"
        />
        <div className="flex space-x-4">
          <CsvExport users={filteredUsers} />
          <button
            className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            onClick={() => setShowAddUser(true)}
          >
            Add User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white mx-8 shadow-md rounded-lg p-6">
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <UserTable
            users={users}
            filteredUsers={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUser
          onClose={() => setShowAddUser(false)}
          onUserAdded={handleUserAdded}
        />
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <EditUser
          user={selectedUser}
          onClose={() => {
            setShowEditUser(false);
            setSelectedUser(null);
          }}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default AdminPage;

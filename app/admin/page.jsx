"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import AddUser from "../../components/admin/AddUser";
import EditUser from "../../components/admin/EditUser";
import CsvExport from "../../components/admin/CsvExport";
import UserTable from "../../components/admin/UserTable";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";

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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
      </div>

      {/* Search, Export, Add User */}
      <div className="flex items-center justify-between px-8 py-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users"
          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <div className="flex space-x-4">
          <CsvExport users={filteredUsers} />
          <button
            className="px-6 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-700"
            onClick={() => setShowAddUser(true)}
          >
            Add User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="p-6 mx-8 bg-white rounded-lg shadow-md">
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
"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import CsvExport from "./CsvExport";

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]); // Store users
    const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
    const [searchQuery, setSearchQuery] = useState(""); // Search input value
    const [showAddUser, setShowAddUser] = useState(false); // Controls Add User modal
    const [showEditUser, setShowEditUser] = useState(false); // Controls Edit User modal
    const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/auth");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setIsAuthenticated(false);
                router.push("/auth");
            } else {
                setIsAuthenticated(true);
                await fetchUsers(); // Fetch users from Firestore
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
            setFilteredUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

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

    const handleAddUser = () => {
        setShowAddUser(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditUser(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            // Delete user from Firestore
            const userDoc = doc(db, "users", userId);
            await deleteDoc(userDoc);

            // Update local state
            const updatedUsers = users.filter((user) => user.id !== userId);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleUserAdded = async (newUser) => {
        try {
            const usersCollection = collection(db, "users");
            const docRef = await addDoc(usersCollection, newUser);
            const userWithId = { ...newUser, id: docRef.id };

            setUsers((prev) => [...prev, userWithId]);
            setFilteredUsers((prev) => [...prev, userWithId]);
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            const userDoc = doc(db, "users", updatedUser.id);
            await updateDoc(userDoc, updatedUser);

            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-xl font-bold text-gray-800">User Management</h1>
            </div>

            {/* Search Bar, Export to CSV, and Add User Buttons */}
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
                        onClick={handleAddUser}
                    >
                        Add User
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white mx-8 shadow-md rounded-lg p-6">
                <div className="grid grid-cols-5 gap-4 font-semibold text-gray-600 border-b pb-2">
                    <span>Full Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Last Active</span>
                    <span>Actions</span>
                </div>

                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="grid grid-cols-5 gap-4 items-center text-gray-800 border-b py-2"
                    >
                        <span>{user.name}</span>
                        <span className="text-gray-500">{user.email}</span>
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-center">
                            {user.role}
                        </span>
                        <span className="text-gray-500">{user.lastActive || "Unknown"}</span>
                        <div className="flex gap-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400"
                                onClick={() => handleEditUser(user)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
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
